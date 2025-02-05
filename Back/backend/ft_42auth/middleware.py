from django.utils.timezone import now
from user_service.models import User
from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
import jwt
import logging
class OnlineStatusMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        jwt_token = request.COOKIES.get("jwt")
        if jwt_token:
            try:
                decoded_token = jwt.decode(
                    jwt_token,
                    settings.SIMPLE_JWT['SIGNING_KEY'],
                    algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
                )
                user_id = decoded_token.get("id")
                User.objects.filter(id_user=user_id).update(is_online=True, last_seen=now())
            except jwt.InvalidTokenError:
                pass 
        
        response = self.get_response(request)
        return response