class Arena:
    """
    Represents the game arena with fixed dimensions and boundary management.
    """
    def __init__(self, arena_id=None):
        """
        Initialize the arena with standard dimensions.
        
        :param arena_id: Optional identifier for the arena
        """
        # Arena dimensions (matching frontend implementation)
        self.arena_width = 2.1
        self.arena_height = 1.1
        self.arena_depth = 0.1
        self.arena_id = arena_id or 'default_arena'

    def get_boundaries(self):
        """
        Calculate and return the boundary coordinates for the arena.
        
        :return: Dict of boundary coordinates
        """
        return {
            'x_min': -self.arena_width / 2,
            'x_max': self.arena_width / 2,
            'y_min': -self.arena_height / 2,
            'y_max': self.arena_height / 2,
            'z_min': -self.arena_depth / 2,
            'z_max': self.arena_depth / 2,
        }

    def validate_position(self, x, y, z=0):
        """
        Validate if a given position is within arena boundaries.
        
        :param x: X coordinate
        :param y: Y coordinate
        :param z: Z coordinate (optional)
        :return: Boolean indicating if position is valid
        """
        boundaries = self.get_boundaries()
        return (
            boundaries['x_min'] <= x <= boundaries['x_max'] and
            boundaries['y_min'] <= y <= boundaries['y_max'] and
            boundaries['z_min'] <= z <= boundaries['z_max']
        )
