from django.shortcuts import render
from django.http import HttpResponseRedirect,JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import User
from rest_framework.decorators import api_view,permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import datetime
import requests
import jwt
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
import os
from backend import settings

def handle_token(user_id:int,two_factor:bool) -> str:
    payload = {
        'id': user_id,
        'twofa': two_factor,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow()
    }
    jwt_config = settings.SIMPLE_JWT
    signing_key = jwt_config['SIGNING_KEY']
    algorithm = jwt_config['ALGORITHM']    
    token=jwt.encode(payload, signing_key, algorithm)
    return token