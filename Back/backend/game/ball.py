import random
import threading
import math
from .power_up import PowerUp

class Ball:
    """
    Represents the ball in the Pong game with movement and collision logic.
    """
    def __init__(self, arena):
        """
        Initialize the ball with default properties.
        
        :param arena: Arena instance the ball belongs to
        """
        self.arena = arena
        
        # Ball properties
        self.radius = 0.03
        self.max_speed = 0.03

        # Power Up
        self.consecutive_goals = {'left': 0, 'right': 0}
        self.power_up = None
        self.is_power_up_allowed = None
        
        # Initial position and velocity
        self.reset()

    def reset(self, direction=None):
        """
        Reset ball to initial position and velocity.
        
        :param direction: Initial ball direction (-1 or 1)
        """
        # Center of the arena
        self.x = 0
        self.y = 0
        
        # Initial velocity
        if direction is None:
            direction = random.choice([-1, 1])
        
        # Random angle within -22.5 to 22.5 degrees
        angle = (random.random() * math.pi / 4) - math.pi / 8
        speed = 0.025
        
        self.vx = speed * math.cos(angle) * direction
        self.vy = 0

    def update(self, paddles):
        """
        Update ball position based on current velocity.
        """
        # Move ball
        self.x += self.vx
        self.y += self.vy

        self.prev_y = self.y
        # Bounce off top and bottom walls
        if (self.y + self.radius > self.arena.arena_height / 2 or 
            self.y - self.radius < -self.arena.arena_height / 2):
            self.vy = -self.vy * 1.025
            self.y = self.prev_y

        # Ensure ball doesn't exceed max speed
        current_speed = math.sqrt(self.vx ** 2 + self.vy ** 2)
        if current_speed > self.max_speed:
            scale = self.max_speed / current_speed
            self.vx *= scale
            self.vy *= scale

        if self.power_up:
            if not self.power_up.is_active and self.power_up.check_expired():
                self.power_up = None
                return
            
            if not self.power_up.is_active and self.power_up.check_collision():
                self.power_up.apply_power_up()
                threading.Timer(self.power_up.activation_duration, self.clear_power_up).start()

    def clear_power_up(self):
        self.power_up = None

    def bounce_off_paddle(self, paddle, is_left_paddle):
        """
        Calculate ball bounce when hitting a paddle.
        
        :param paddle: Paddle instance
        :param is_left_paddle: Boolean indicating paddle side
        """
        # Calculate bounce angle
        bounce_angle = paddle.calculate_bounce_angle(self.y)
        
        # Calculate current speed
        speed = math.sqrt(self.vx ** 2 + self.vy ** 2) * 1.05
        
        # Update velocities
        self.vx = speed * math.cos(bounce_angle) * (1 if is_left_paddle else -1)
        self.vy = -speed * math.sin(bounce_angle)

        # Move ball out of paddle to prevent multiple collisions
        paddle_x = paddle.paddle_x
        self.x = paddle_x + (1 if is_left_paddle else -1) * (paddle.paddle_width / 2 + self.radius)

    def check_goal(self, paddles):
        """
        Check if a goal has been scored.
        
        :param paddles: Dict of paddles
        :return: Side that scored (None if no goal)
        """
        goal_side = None
        if self.x + self.radius > self.arena.arena_width / 2:
            goal_side = 'left'
            paddles['left'].score += 1

            if (self.is_power_up_allowed):
                paddles['left'].consecutive_goals += 1
                paddles['right'].consecutive_goals = 0

                if paddles['left'].consecutive_goals == 3:
                    paddles['left'].consecutive_goals = 0
                    self.power_up = PowerUp(self.arena, paddles['left'], self)
                    self.power_up.spawn()

        elif self.x - self.radius < -self.arena.arena_width / 2:
            goal_side = 'right'
            paddles['right'].score += 1

            if (self.is_power_up_allowed):
                paddles['right'].consecutive_goals += 1
                paddles['left'].consecutive_goals = 0

                if paddles['right'].consecutive_goals == 3:
                    paddles['right'].consecutive_goals = 0
                    self.power_up = PowerUp(self.arena, paddles['right'], self)
                    self.power_up.spawn()

        return goal_side
