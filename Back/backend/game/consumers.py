import asyncio
import uuid
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.core.cache import cache  # Django cache
from django.db import models
from .game_state import GameState
from .models import Room
from .arena import Arena
from .models import InGameUsers
from ft_42auth.models import User
from django.shortcuts import get_object_or_404

#-----------------------------------------------Game Consumer--------------------------------
class GameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

        self.room_id = None
        self.room_group_name = None
        self.id = None
        self.game_settings = None
        self.gameState = None
        self.game_loop_started = False
        self.game_start = False
        self.user_1 = None
        self.user_2 = None

    async def disconnect(self, close_code):
        ready_count = cache.get(f"{self.room_group_name}_ready_count", 0)
        if self.room_group_name and self.id:
            # Update game state to reflect disconnection
            if self.gameState : #and ready_count == 2:
                self.gameState.handle_disconnect(self.id)
                
                # Update the cached game state
                cache.set(self.room_group_name, self.gameState)

                # Notify remaining player about the disconnection and game result
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "game_state",
                        "event": "state_update",
                        "state": self.gameState.to_dict()
                    }
                )

        # Leave the room group
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

        # Update the room's player count and clean up
        if self.room_id:
            try:
                room = await sync_to_async(Room.objects.get)(room_id=self.room_id)
                room.current_players -= 1
                if room.current_players == 0:
                    self.gameState.game_over = True
                    await sync_to_async(room.delete)()
                elif room.current_players <= 1 and ready_count == 2:
                    self.gameState.game_over = True
                    await sync_to_async(room.delete)()
                else:
                    await sync_to_async(room.save)()
            except Room.DoesNotExist:
                print(f"Room {self.room_id} does not exist.")

        # Set isInGame to False for the user
        if self.user_1:
            print('Reset 1--> ', self.id)
            user = await sync_to_async(get_object_or_404)(User, id_user=self.user_1['id_user'])
            user.isInGame = False
            await sync_to_async(user.save)()

        if self.user_2:
            print('Reset 2--> ', self.id)
            user = await sync_to_async(get_object_or_404)(User, id_user=self.user_2['id_user'])
            user.isInGame = False
            await sync_to_async(user.save)()
        # Cancel game loop if it's running
        if hasattr(self, 'game_loop_task') and self.game_loop_task:
            self.game_start = False
            self.game_loop_task.cancel()
            self.game_loop_started = False
            cache.set(f"{self.room_group_name}_game_loop_started", False)

    # This method handles incoming WebSocket messages (e.g., key presses)
    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data.get("event")
        key = data.get("key")
        client_id = data.get("client_id")
        client_info = data.get("client")
        settings = data.get("settings")
        reserved_room_id = data.get("room_id")


        if event == 'disconnect':
            inGame = await sync_to_async(InGameUsers.objects.filter(
                id_user=client_info['id_user'],
            ).first)()
            if inGame:
                await sync_to_async(inGame.delete)()

            self.disconnect(close_code=None)

        #~~~~ Create a new room ~~~~
        if event == "create_room":
            room_id = uuid.uuid4().hex[:8]

            if reserved_room_id:
                room_id = reserved_room_id
            room = await sync_to_async(Room.objects.create)(
                room_id=room_id,
                max_players=2,
                current_players=1,
            )

            # Set up room connection
            self.room_id = room.room_id
            self.room_group_name = f"game_{self.room_id}"
            self.id = 1  # Creator is always player 1

            self.user_1 = client_info

            inGame = await sync_to_async(InGameUsers.objects.filter(
                id_user=self.user_1['id_user'],
            ).first)()

            if inGame:
                await self.send(text_data=json.dumps({
                    "event": "already_ingame",
                }))
                return
            else:
                inGame = await sync_to_async(InGameUsers.objects.create)(
                    id_user=self.user_1['id_user'],
                )
                await sync_to_async(inGame.save)()


            cache.set(f"{self.room_group_name}_player1", self.user_1)
            user = await sync_to_async(get_object_or_404)(User, id_user=self.user_1['id_user'])

            if user.isInGame:
                await self.send(text_data=json.dumps({
                    "event": "already_ingame",
                }))
                return
            elif not user.isInGame:
                user.isInGame = True
            await sync_to_async(user.save)()
            
            # Initialize game state
            self.gameState = GameState(room_id=self.room_id)
            self.gameState.player1 = user
            cache.set(self.room_group_name, self.gameState)
            
            # Join the room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # Notify client of successful room creation
            await self.send(text_data=json.dumps({
                "event": "room_created",
                "room_id": self.room_id,
                "client_id": self.id,
            }))

        #~~~~ Join a room ~~~~
        elif event == "join_room":
            try:
                # Check if trying to join a tournament room
                if reserved_room_id:
                    room = await sync_to_async(Room.objects.filter(
                        room_id=reserved_room_id,
                        current_players__lt=models.F('max_players')
                    ).first)()
                else:
                    room = await sync_to_async(Room.objects.filter(
                        current_players__lt=models.F('max_players')
                    ).first)()
                
                if room:
                    # Join existing room
                    room.current_players += 1
                    await sync_to_async(room.save)()
                    
                    self.room_id = room.room_id
                    self.room_group_name = f"game_{self.room_id}"
                    self.id = room.current_players

                    self.user_2 = client_info
                    cache.set(f"{self.room_group_name}_player2", self.user_2)

                    user = await sync_to_async(get_object_or_404)(User, id_user=self.user_2['id_user'])

                    inGame = await sync_to_async(InGameUsers.objects.filter(
                        id_user=self.user_2['id_user'],
                    ).first)()

                    if inGame:
                        await self.send(text_data=json.dumps({
                            "event": "already_ingame",
                        }))
                        return
                    else:
                        inGame = await sync_to_async(InGameUsers.objects.create)(
                            id_user=self.user_2['id_user'],
                        )
                        await sync_to_async(inGame.save)()

                    
                    # Get existing game state
                    self.gameState = cache.get(self.room_group_name)
                    self.gameState.player2 = user
                    self.game_settings = cache.get(f"{self.room_group_name}_settings")
                    
                    # Join the room group
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )
                    
                    # Send join confirmation with any existing settings
                    response_data = {
                        "event": "room_joined",
                        "room_id": self.room_id,
                        "client_id": self.id,
                    }
                    if self.game_settings:
                        response_data["settings"] = self.game_settings
                    
                    await self.send(text_data=json.dumps(response_data))
                    
                    # Start game loop if not already started
                    if not self.game_loop_started:
                        self.game_loop_started = True
                        cache.set(f"{self.room_group_name}_game_loop_started", True)
                        self.game_loop_task = asyncio.create_task(self.game_loop())
                else:
                    # No available rooms
                    await self.send(text_data=json.dumps({
                        "event": "join_failed",
                        "reason": "No available rooms"
                    }))
            
            except Exception as e:
                print(f"Error joining room: {e}")
                await self.send(text_data=json.dumps({
                    "event": "join_failed",
                    "reason": "Error joining room"
                }))

        #~~~~ Settings for the Room ~~~~
        if event == "settings":
            cache.set(f"{self.room_group_name}_settings", settings)

            self.gameState.update_settings(settings)  # You'll need to add this method to GameState
            cache.set(self.room_group_name, self.gameState)  # Update cached GameState

        #~~~~ Ready to Start ~~~~
        if event == "ready":
            ready_count = cache.get(f"{self.room_group_name}_ready_count", 0)
            ready_count += 1
            cache.set(f"{self.room_group_name}_ready_count", ready_count)

            self.user_1 = cache.get(f"{self.room_group_name}_player1")
            self.user_2 = cache.get(f"{self.room_group_name}_player2")

            if ready_count == 2:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "ready_event",
                        "event": event,
                        "player_1": self.user_1,
                        "player_2": self.user_2,
                    }
                )

        #~~~~ Game Pause and Start ~~~~
        if event == "game_start":
            self.game_start = True
        if event == "game_pause":
            self.game_start = False

        if event and key:
            if event == "keydown" or event == "keyup":
                # Broadcast the message to the group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "key_event",
                        "client_id": client_id,
                        "event": event,
                        "key": key,
                    }
                )

    async def game_state(self, event):
        await self.send(json.dumps({
            "event": event["event"],
            "state": event["state"]
        }))

    async def key_event(self, event):
        self.gameState.paddle_update(event["client_id"], event["event"], event["key"])

    async def ready_event(self, event):
        # Send the ready event to the WebSocket
        await self.send(text_data=json.dumps({
            "event": event["event"],
            "player_1": event["player_1"],
            "player_2": event["player_2"],
        }))

    async def game_loop(self):
        while True:
            # Update the game state
            if self.game_start and not self.gameState.game_over:
                self.gameState.update()

            # Check if there's a pending XP update
            if hasattr(self.gameState, 'pending_win_update'):
                await self.gameState.pending_win_update
                delattr(self.gameState, 'pending_win_update')

            # Send the updated game state to the frontend
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_state",
                    "event": "state_update",
                    "state": self.gameState.to_dict()
                }
            )
            # Sleep for a short duration to achieve the desired update rate (e.g., 60 FPS)
            await asyncio.sleep(1 / 60)
