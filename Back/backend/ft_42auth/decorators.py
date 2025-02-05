from base64 import b32encode
import base64
from functools import wraps
import io
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
import jwt
from .models import User
from django.core.exceptions import ObjectDoesNotExist

from pyotp import random_base32
from pyotp import TOTP
import qrcode

def jwt_cookie_check(base_function):
    @wraps(base_function)
    def wrapper(self, request, *args, **kwargs):
       
        jwt_token = request.COOKIES.get("jwt")
        
        if jwt_token is None:
            
            return Response({"detail": "Unauthorized access. Please log in...."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            
            
            jwt_config = settings.SIMPLE_JWT
            signing_key = jwt_config['SIGNING_KEY']
            algorithm = jwt_config['ALGORITHM']
            try:
                decoded_token = jwt.decode(jwt_token, signing_key, algorithms=[algorithm])
                request.decoded_token = decoded_token
                user_id = decoded_token.get('id')
                user=get_user(user_id)
                if user is None:
                    return Response({"detail": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

                return base_function(self,request)
            except jwt.ExpiredSignatureError:
                return Response({"detail": "Token has expired."}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({"detail": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
            
            
    
    return wrapper


## get User by id

def get_user(id):
    try:
        return User.objects.get(id_user=id)
    except User.DoesNotExist:
        return None



def setup_2fa(user :User) -> str:
    secret = random_base32()
    user.two_factor_secret = secret
    # user.is_2fa_enabled=True
    user.save()
    return secret

# ## Generate QR code URI for 2FA setup 

def get_qrcode(user :User) -> str:
    if  not user.two_factor_secret :
        raise ValueError("2FA secret not found for user.")  
    totp=TOTP(user.two_factor_secret)
    return totp.provisioning_uri(name=user.username, issuer_name="ft_transcendence")
        
        
def check_2fa_code(user: User, code: str) -> bool:
   
    if not user.two_factor_secret:
    
        return False

    totp = TOTP(user.two_factor_secret)
    return totp.verify(str(code))


def generate_qr_image(qr_uri: str) -> bytes:
   
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_uri)
    qr.make(fit=True)
    
    
    img_buffer = io.BytesIO()
  
    qr.make_image(fill_color="black", back_color="white").save(img_buffer)
    
    return img_buffer.getvalue()   

def generate_base64_image(qr_uri: str) -> str:
    qr_img = generate_qr_image(qr_uri)
    return base64.b64encode(qr_img).decode('utf-8') 
