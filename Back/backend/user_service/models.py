from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.postgres.fields import ArrayField
from enum import Enum
from ft_42auth.models import User  



class Friendship(models.Model):
    class Status(Enum):
        ACCEPTED = 'AC'
        PENDING = 'PN'
    
    STATUS_CHOICES = [
        (Status.ACCEPTED.value, 'ACCEPTED'),
        (Status.PENDING.value, 'PENDING'),
    ]
    
    id_friendship = models.AutoField(primary_key=True)
    id_user = models.ForeignKey(User, related_name="sent_friend_requests", on_delete=models.CASCADE)
    id_friend = models.ForeignKey(User, related_name="received_friend_requests", on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=Status.PENDING.value)

    def __str__(self):
        return f"{self.id_user} - {self.id_friend} ({self.get_status_display()})"
 