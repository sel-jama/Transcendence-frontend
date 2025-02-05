from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from django.conf import settings

class User(AbstractBaseUser):
    CLAN_CHOICES = [
        ('VERTEX', 'Vertex'),
        ('RAIDERS', 'Raiders'),
        ('PHANTOM', 'Phantom'),
        ('VIGILANTS', 'Vigilants'),
    ]
    ACHIEVEMENT_CHOICES = [
        ('UNSTOPPABLE', 'unstoppable'),
        ('FIRST BLOOD', 'first blood'),
        ('LOYALIST', 'loyalist'),
        ('CONQUEROR', 'conqueror')
    ]
    id_user = models.AutoField(primary_key=True)
    @property
    def id(self):
        return self.id_user
    auth_42=models.BooleanField(default=False)
    username = models.CharField(max_length=255, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    password = models.CharField(max_length=255, blank=False, null=False)
    is_active = models.BooleanField(default=True)
    avatar = models.URLField(blank=True, null=True)
    xp = models.IntegerField(default=0)
    clan = models.CharField(max_length=255, choices=CLAN_CHOICES, default='VERTEX')
    nickname = models.CharField(max_length=255, blank=True, null=True)
    is_first_login = models.BooleanField(default=True)
    
    is_2fa_enabled=models.BooleanField(default=False)
    two_factor_secret=models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    clan_logo = models.URLField(blank=True, null=True)
    match_win=models.IntegerField(default=0)
    match_lose=models.IntegerField(default=0)
    win_rate = models.FloatField(
    default=0.0,
    blank=True
)
    tournamentsWon=models.IntegerField(default=0)
    pointsScored= models.IntegerField(default=0)
    longestStreak=models.IntegerField(default=0)
    gameCount=models.IntegerField(default=0)
    clanDuration=models.IntegerField(default=0)
    achievment=ArrayField(
        models.CharField(
            max_length=50,
            choices=ACHIEVEMENT_CHOICES,
        ),
        default=list, # it will be 0 awal mra
        blank=True
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    matchHistory = ArrayField(
           models.JSONField(),
           default=list,
           blank=True
       )

    # Define a ManyToManyField for friendships
    friends = models.ManyToManyField(
        'self',
        symmetrical=True,
        blank=True
    )
    isInGame = models.BooleanField(default=False)  # New field added here
    

    def __str__(self):
        return self.email

class Match(models.Model):
    
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_player'
    )

 
    opponent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='matches_as_opponent'
    )

   
    player_score = models.IntegerField(default=0)
    opponent_score = models.IntegerField(default=0)

    
    match_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.username} vs {self.opponent.username} - {self.player_score}:{self.opponent_score}"
