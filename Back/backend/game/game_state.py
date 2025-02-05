from asgiref.sync import sync_to_async
import asyncio
from copy import deepcopy
from .arena import Arena
from .ball import Ball
from .paddle import Paddle
from django.utils import timezone

class GameState:
    """
    Manages the overall state of the Game.
    """
    def __init__(self, room_id=None):
        """
        Initialize a new game state.
        
        :param room_id: Optional identifier for the game room
        """
        self.room_id = room_id or 'default_room'
        self.player1 = None
        self.player2 = None
        
        # Create arena and game components
        self.arena = Arena(self.room_id)
        self.ball = Ball(self.arena)
        self.is_power_up_allowed = None
        
        # Create paddles
        self.paddles = {
            'left': Paddle(self.arena, side='left', clan= 'VERTEX'),
            'right': Paddle(self.arena, side='right', clan= 'SCAVENGERS')
        }
        
        # Game state tracking
        self.game_over = False
        self.winning_score = 5
        self.winner = None
        self.keyPressed = {
            'leftUp': False,
            'leftDown': False,
            'rightUp': False,
            'rightDown': False
        }

    def update_settings(self, settings):
        """Update game settings and apply them to the game state"""
        self.is_power_up_allowed = settings['powerUpsEnabled']
        self.ball.is_power_up_allowed = self.is_power_up_allowed  # You'll need to add this method to GameState

    def paddle_update(self, client_id, event, key):
        if key == 38 or key == 40:
            if event == "keydown":
                if key == 38:
                    key_side = 'leftUp' if client_id == 1 else 'rightUp'
                    self.keyPressed[key_side] = True
                elif key == 40:
                    key_side = 'leftDown' if client_id == 1 else 'rightDown'
                    self.keyPressed[key_side] = True
            elif event == "keyup":
                if key == 38:
                    key_side = 'leftUp' if client_id == 1 else 'rightUp'
                    self.keyPressed[key_side] = False
                elif key == 40:
                    key_side = 'leftDown' if client_id == 1 else 'rightDown'
                    self.keyPressed[key_side] = False

    def update(self):
        """
        Update game state - move ball, check collisions, score goals.
        """
        # Update ball position
        self.ball.update(self.paddles)

        if self.keyPressed['rightUp']:
            self.paddles['right'].move('up')
        if self.keyPressed['rightDown']:
            self.paddles['right'].move('down')
        if self.keyPressed['leftUp']:
            self.paddles['left'].move('up')
        if self.keyPressed['leftDown']:
            self.paddles['left'].move('down')

        # Check paddle collisions
        if self.paddles['left'].check_collision(self.ball.x, 
                                     self.ball.y, 
                                     self.ball.radius):
            self.ball.bounce_off_paddle(self.paddles['left'], is_left_paddle=True)
        
        if self.paddles['right'].check_collision(self.ball.x, 
                                     self.ball.y, 
                                     self.ball.radius):
            self.ball.bounce_off_paddle(self.paddles['right'], is_left_paddle=False)

        # Check for goal
        goal_side = self.ball.check_goal(self.paddles)
        if goal_side:
            # Reset ball after goal
            self.ball.reset(direction=1 if goal_side == 'left' else -1)
            self.paddles["left"].reset();
            self.paddles["right"].reset();

        # Check for game over condition
        for side, paddle in self.paddles.items():
            if paddle.score >= self.winning_score:
                self.game_over = True
                self.winner = paddle.side

                if self.winner == 'left':
                    @sync_to_async
                    def update_player_stat():
                        if self.player1.match_win == 0:
                            self.player1.achievment.append('FIRST BLOOD')
                        self.player1.match_win += 1
                        self.player1.longestStreak += 1
                        if self.player1.longestStreak == 5:
                            self.player1.achievment.append('UNSTOPPABLE')
                        self.player1.xp += 10
                        self.player1.gameCount = (self.player1.match_win + self.player1.match_lose)
                        self.player1.win_rate = (self.player1.match_win / self.player1.gameCount) * 100
                        self.player1.pointsScored += self.paddles["left"].score;
                        if self.player1.match_win == 10:
                            self.player1.achievment.append('CONQUEROR')

                        self.player2.match_lose += 1
                        self.player2.longestStreak = 0
                        self.player2.gameCount = (self.player2.match_win + self.player2.match_lose)
                        self.player2.win_rate = (self.player2.match_win / self.player2.gameCount) * 100
                        self.player2.pointsScored += self.paddles["right"].score;

                        self.player1.matchHistory.append({
                            "player": self.player1.username,
                            "opponent": self.player2.username,
                            "player_score": self.paddles['left'].score,
                            "opponent_score": self.paddles['right'].score,
                            "match_date": timezone.now().strftime("%b %d, %H:00")
                        })

                        self.player2.matchHistory.append({
                            "player": self.player2.username,
                            "opponent": self.player1.username,
                            "player_score": self.paddles['right'].score,
                            "opponent_score": self.paddles['left'].score,
                            "match_date": timezone.now().strftime("%b %d, %H:00")
                        })

                        self.player1.save()
                        self.player2.save()
                else:
                    @sync_to_async
                    def update_player_stat():
                        if self.player2.match_win == 0:
                            self.player2.achievment.append('FIRST BLOOD')
                        self.player2.match_win += 1
                        self.player2.longestStreak += 1
                        if self.player2.longestStreak == 5:
                            self.player2.achievment.append('UNSTOPPABLE')
                        self.player2.xp += 10
                        self.player2.gameCount = (self.player2.match_win + self.player2.match_lose)
                        self.player2.win_rate = (self.player2.match_win / self.player2.gameCount) * 100
                        self.player2.pointsScored += self.paddles["right"].score;
                        if self.player2.match_win == 10:
                            self.player2.achievment.append('CONQUEROR')

                        self.player1.match_lose += 1
                        self.player1.longestStreak = 0
                        self.player1.gameCount = (self.player1.match_win + self.player1.match_lose)
                        self.player1.win_rate = (self.player1.match_win / self.player1.gameCount) * 100
                        self.player1.pointsScored += self.paddles["left"].score;

                        self.player1.matchHistory.append({
                            "player": self.player1.username,
                            "opponent": self.player2.username,
                            "player_score": self.paddles['left'].score,
                            "opponent_score": self.paddles['right'].score,
                            "match_date": timezone.now().strftime("%b %d, %H:00")
                        })

                        self.player2.matchHistory.append({
                            "player": self.player2.username,
                            "opponent": self.player1.username,
                            "player_score": self.paddles['right'].score,
                            "opponent_score": self.paddles['left'].score,
                            "match_date": timezone.now().strftime("%b %d, %H:00")
                        })

                        self.player2.save()
                        self.player1.save()

                # Store the coroutine for the consumer to await
                self.pending_win_update = update_player_stat()
                break


    def handle_disconnect(self, player_id):
        """
        Handle player disconnection by setting appropriate scores and game over state.
        
        :param player_id: ID of the disconnected player (1 for left, 2 for right)
        """
        self.game_over = True
        self.winner = 'draw'
        if player_id == 1:
            self.paddles['right'].score = 0
            self.paddles['left'].score = 0
        else:
            self.paddles['left'].score = 0
            self.paddles['right'].score = 0

    def to_dict(self):
        """
        Convert game state to a dictionary representation.
        
        :return: Dict containing current game state
        """
        power_up_info = None
        if self.ball.power_up:
            power_up_info = {
                'x': self.ball.power_up.x,
                'y': self.ball.power_up.y,
                'is_active': self.ball.power_up.is_active,
                'clan': self.ball.power_up.clan,
            }

        game_over = None
        if self.game_over:
            game_over = {
                    'winner': self.winner 
                }

        return {
            # 'room_id': self.room_id,
            'ball': {
                'x': self.ball.x,
                'y': self.ball.y,
                'vx': self.ball.vx,
                'vy': self.ball.vy,
            },
            'paddles': {
                side: {
                    'x': paddle.paddle_x,
                    'y': paddle.y,
                    'score': paddle.score,
                    'speed': paddle.paddle_speed,
                    'height': paddle.paddle_height,
                    'illusion': paddle.illusion,
                } for side, paddle in self.paddles.items()
            },
            'power_up': power_up_info,
            'game_over': game_over,
        }
