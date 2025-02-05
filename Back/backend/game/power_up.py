import random
import math
import time
import threading

class PowerUp:
    def __init__(self, arena, owner, ball):
        self.arena = arena
        self.owner = owner
        self.clan = self.owner.clan
        self.ball = ball

        self.is_active = False
        self.original_owner_size = owner.paddle_height
        self.original_owner_speed = owner.paddle_speed

        self.size = 0.05
        self.spawn_time = time.time()
        self.duration = 10
        self.activation_duration = 10

        self.x = 0
        self.y = 0

    def spawn(self):
        max_x = (self.arena.arena_width / 2) - (self.size * 2)
        max_y = (self.arena.arena_height / 2) - (self.size * 2)
        
        self.x = (random.random() * 2 - 1) * max_x
        self.x = (random.random() * 2 - 1) * max_x
        # self.x = 0.5
        # self.y = 0

    def check_expired(self):
        return time.time() - self.spawn_time >= self.duration

    def check_collision(self):
        """
        Check if the ball collides with the power-up.
    
        :return: Boolean indicating collision
        """
        # Check if the ball is moving in the correct direction
        is_valid_direction = (
            (self.owner.side == 'left' and self.ball.vx > 0) or
            (self.owner.side == 'right' and self.ball.vx < 0)
        )
        
        if not is_valid_direction:
            return False
        
        # Collision detection
        power_up_bounds = {
            'min_x': self.x - self.size/2,
            'max_x': self.x + self.size/2,
            'min_y': self.y - self.size/2,
            'max_y': self.y + self.size/2
        }
        
        ball_bounds = {
            'min_x': self.ball.x - self.ball.radius,
            'max_x': self.ball.x + self.ball.radius,
            'min_y': self.ball.y - self.ball.radius,
            'max_y': self.ball.y + self.ball.radius
        }
        
        return not (
            power_up_bounds['min_x'] > ball_bounds['max_x'] or 
            power_up_bounds['max_x'] < ball_bounds['min_x'] or 
            power_up_bounds['min_y'] > ball_bounds['max_y'] or 
            power_up_bounds['max_y'] < ball_bounds['min_y']
        )

    def apply_power_up(self):
        self.is_active = True

        if self.owner.clan == 'SCAVENGERS':
            self.size_power_up()
        elif self.owner.clan == 'RAIDERS':
            self.speed_power_up()
        elif self.owner.clan == 'VERTEX':
            self.illusion_power_up()

    def speed_power_up(self):
        self.owner.paddle_speed *= 1.5

        timer = threading.Timer(self.activation_duration, self.remove_ability)
        timer.start()

    def size_power_up(self):
        self.owner.paddle_height = 0.4

        timer = threading.Timer(self.activation_duration, self.remove_ability)
        timer.start()

    def illusion_power_up(self):
        self.owner.illusion = True

        timer = threading.Timer(self.activation_duration, self.remove_ability)
        timer.start()
        # self.illusions = []
        # num_illusions = 2
        #
        # for _ in range(num_illusions):
        #     illusion = self.houdini_phantomforge()
        #     self.illusions.append(illusion)

    # def houdini_phantomforge(self):

    def remove_ability(self):
        """
        Remove the power-up ability and reset paddle to original state.
        """
        self.is_active = False

        # self.owner.paddle_speed = self.original_owner_speed
        
        if self.owner.clan == "SCAVENGERS":
            self.owner.paddle_height = self.original_owner_size
        elif self.owner.clan == "RAIDERS":
            self.owner.paddle_speed = self.original_owner_speed
        elif self.owner.clan == "VERTEX":
            self.owner.illusion = False
