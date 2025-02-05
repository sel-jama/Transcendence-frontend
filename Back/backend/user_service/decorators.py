from functools import wraps
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
import jwt
from .models import User
from django.core.exceptions import ObjectDoesNotExist



def jwt_cookie_check(base_function):
    @wraps(base_function)
    def wrapper(self, request, *args, **kwargs):
        jwt_token = request.COOKIES.get("jwt")
        if jwt_token is None:
            
            return Response({"detail": "Unauthorized access. Please log in."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            jwt_config = settings.SIMPLE_JWT
            signing_key = jwt_config['SIGNING_KEY']
            algorithm = jwt_config['ALGORITHM']
            try:
                decoded_token = jwt.decode(jwt_token, signing_key, algorithms=[algorithm])
                request.decoded_token = decoded_token  
                return base_function(self,request)
            except jwt.ExpiredSignatureError:
                return Response({"detail": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
            
            return base_function(self, request, *args, **kwargs)
    
    return wrapper


## get User by id

def get_user(id):
    try:
        return User.objects.get(id_user=id)
    except User.DoesNotExist:
        return None