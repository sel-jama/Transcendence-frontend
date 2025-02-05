from copy import deepcopy
from django.db import models
import uuid

# Create your models here.

class Room(models.Model):
    room_id = models.CharField(max_length=8)
    max_players = models.IntegerField(default=2)
    current_players = models.IntegerField(default=0)

    def __str__(self):
        return self.room_id


class InGameUsers(models.Model):
    id_user = models.AutoField(primary_key=True)
