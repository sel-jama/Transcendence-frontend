from django.http import JsonResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
import jwt
import logging

logger = logging.getLogger(__name__)

class SimpleMiddleware:
    def __init__(self, get_response):
        
        self.get_response = get_response

    def __call__(self, request):
        
        app_name = request.path.split('/')[1]
        
        if app_name in ['game', 'user']: 
           
            
            
            jwt_token = request.COOKIES.get("jwt")
        
            if jwt_token is None:
                
                return JsonResponse({"detail": "Unauthorized access. Please log in...."}, status=status.HTTP_401_UNAUTHORIZED)
            
            jwt_config = settings.SIMPLE_JWT
            signing_key = jwt_config['SIGNING_KEY']
            algorithm = jwt_config['ALGORITHM']
            
            try:
                
                decoded_token = jwt.decode(jwt_token, signing_key, algorithms=[algorithm])
                request.decoded_token = decoded_token  
                
            except jwt.ExpiredSignatureError:
                
                logger.error("Token has expired")
                return JsonResponse({"detail": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
            
            except jwt.InvalidTokenError:
                
                logger.error("Invalid token")
                return JsonResponse({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        response = self.get_response(request)
       
        return response
