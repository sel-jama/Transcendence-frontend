import random
import string
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from rest_framework.exceptions import ValidationError 

from rest_framework_simplejwt.tokens import Token
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    days_since_creation = serializers.SerializerMethodField()
    win_rate = serializers.SerializerMethodField()  

    class Meta:
        model = User
        fields = ['id_user', 'username', 'is_active', 'email', 'password', 'avatar', 'is_2fa_enabled', 
                 'xp', 'clan', 'clan_logo', 'win_rate', 'match_lose', 'match_win', 
                 'days_since_creation', 'tournamentsWon', 'pointsScored', 'longestStreak', 'matchHistory',
                 'gameCount', 'clanDuration', 'achievment', 'auth_42']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
    
    def validate_password(self, value):
        if value:
            
            
            
           
            if not any(char.isupper() for char in value):
                raise ValidationError("Password must contain at least one uppercase letter.")
            
        return value
    
    def get_days_since_creation(self, obj):
        current_date = timezone.now().date()
        created_date = obj.created_at.date()
        return (current_date - created_date).days
    
    def get_win_rate(self, obj):
        total_matches = obj.match_win + obj.match_lose
        if total_matches == 0:
            return 0.0
        return round((obj.match_win / total_matches) * 100, 2)
    
    def create(self, validated_data):
        username = validated_data.get('username')
        is_oauth = validated_data.get('is_oauth')
    

        original_username = username
        if User.objects.filter(username=username).exists():
            raise ValidationError({
                "error": "Username already ",
                "code": "username_exists",
                "status": 400
            })

       
        password = validated_data.pop('password', None)
        if password is None and is_oauth is False:
            raise ValidationError({"password": "This field is required."})
    
        user = self.Meta.model(**validated_data)

        if password is not None:
            user.set_password(password)
        user.save()
        return user