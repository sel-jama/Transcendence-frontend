class Paddle:
    """
    Represents a paddle in the Pong game with movement and scoring capabilities.
    """
    def __init__(self, arena, side="left", clan="SCAVENGERS"):
        """
        Initialize a paddle with given parameters.
        
        :param arena: Arena instance the paddle belongs to
        :param side: Side of the paddle ('left' or 'right')
        :param clan: Optional clan identifier
        """
        self.arena = arena
        
        # Paddle dimensions
        self.paddle_width = 0.06
        self.paddle_height = 0.2
        self.paddle_depth = 0.05
        
        # Paddle positioning
        self.side = side
        self.clan = clan
        self.consecutive_goals = 0
        self.illusion = False
        
        # Position paddle on correct side of arena
        if self.side == "right":
            self.paddle_x = self.arena.arena_width / 2 - self.paddle_width / 2
        else:
            self.paddle_x = -(self.arena.arena_width / 2 - self.paddle_width / 2)
        
        # Initial paddle state
        self.y = 0
        self.score = 0
        self.paddle_speed = 0.02

    def reset(self):
        """
        Reset paddle to initial position.
        """
        self.y = 0

    def move(self, direction):
        """
        Move the paddle in a given direction.
        
        :param direction: 'up' or 'down'
        :return: New y position after movement
        """
        # Calculate new position based on direction
        if direction == 'up':
            new_y = self.y + self.paddle_speed
        elif direction == 'down':
            new_y = self.y - self.paddle_speed
        else:
            return

        # Constrain paddle movement within arena boundaries
        max_y = self.arena.arena_height / 2 - self.paddle_height / 2
        min_y = -self.arena.arena_height / 2 + self.paddle_height / 2

        # Update and return new position
        self.y = max(min_y, min(new_y, max_y))

    def check_collision(self, ball_x, ball_y, ball_radius):
        """
        Check if ball collides with paddle.
        
        :param ball_x: Ball's x position
        :param ball_y: Ball's y position
        :param ball_radius: Ball's radius
        :return: Boolean indicating collision
        """
        return (
            ball_x - ball_radius < self.paddle_x + self.paddle_width / 2 and
            ball_x + ball_radius > self.paddle_x - self.paddle_width / 2 and
            ball_y - ball_radius < self.y + self.paddle_height / 2 and
            ball_y + ball_radius > self.y - self.paddle_height / 2
        )

    def calculate_bounce_angle(self, ball_y):
        """
        Calculate bounce angle based on ball's impact position.
        
        :param ball_y: Ball's y position
        :return: Bounce angle in radians
        """
        # Calculate relative impact position (-1 to 1, from paddle bottom to top)
        relative_intersect_y = (self.y - ball_y) / (self.paddle_height / 2)
        
        # Calculate new angle (-60 to 60 degrees)
        return relative_intersect_y * (3.14159 / 3)
