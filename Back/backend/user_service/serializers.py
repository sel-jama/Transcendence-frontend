from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from rest_framework_simplejwt.tokens import Token
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password','avatar']
        extra_kwargs = {'password': {'write_only': True,'required' : False}}
        
    def create(self, validated_data):
        password=validated_data.pop('password', None)
        user=self.Meta.model(**validated_data)
        if password is not None :
            user.set_password(password)
        user.save()
        return user

