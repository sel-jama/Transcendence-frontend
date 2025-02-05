from urllib.parse import urlencode
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import APIException
import jwt
from user_service.models import Friendship
import os
from django.db.models import Q
from django.shortcuts import redirect

import requests
from django.contrib.auth.hashers import make_password


from rest_framework.views import APIView
from rest_framework.decorators import api_view

from .models import User
from .serializers import UserSerializer
from .decorators import (
    jwt_cookie_check,
    generate_qr_image,
    check_2fa_code,
    setup_2fa,
    get_qrcode
)
from .outils import handle_token
from backend import settings


class APIException(Exception):
   
    def __init__(self, message, status_code, error_code=None):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or status_code
        super().__init__(message)

class AuthenticationError(APIException):
   
    def __init__(self, message, status_code=status.HTTP_401_UNAUTHORIZED):
        super().__init__(message, status_code)


def create_error_response(message, status_code):
   
    return Response({
        'statusCode': status_code,
        'error': message
    }, status=status_code)

def get_user_by_token(decoded_token):
  
    user_id = decoded_token.get('id')
    if not user_id:
        raise AuthenticationError("User ID not found in token", status.HTTP_400_BAD_REQUEST)
    
    try:
        return User.objects.get(id_user=user_id)
    except User.DoesNotExist:
        raise AuthenticationError("User not found", status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)




def get_base_url(request):
    """Get the base URL based on the request host"""
    host = request.get_host().split(':')[0] 
    return f"https://{host}:8443"

class Sign42View(APIView):
    def get(self, request):
        try:
            base_url = get_base_url(request)
            redirect_uri = f"{base_url}"+os.getenv('REDIRECT_URI')
           
            

            # Build the authorization URL dynamically
            auth_params = {
                'client_id': os.getenv('INTRA_CLIENT_ID'),
                'redirect_uri': redirect_uri,
                'response_type': 'code'
            }
            
            authorization_url = f"https://api.intra.42.fr/oauth/authorize?{urlencode(auth_params)}"
           
            
            return HttpResponseRedirect(authorization_url)
        except Exception as e:
           
            return JsonResponse({"statusCode": 500, "error": str(e)})

@api_view(['GET'])
@csrf_exempt
def intra_callback_auth(request):
    base_url = get_base_url(request)
    redirect_uri = f"{base_url}"+os.getenv('REDIRECT_URI')
   
    code = request.GET.get('code')
    message_error = request.GET.get('error')

    if message_error:
        response = redirect(
            f"{base_url}{'/methods' }", 
            permanent=True
            )

        
        return response
    
    if not code:
        return JsonResponse({"statusCode": 401, "error": "Authorization code not provided"})

  
    token_url = "https://api.intra.42.fr/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "client_id": os.getenv('INTRA_CLIENT_ID'),
        "client_secret": os.getenv('INTRA_CLIENT_SECRET'),
        "code": code,
        "redirect_uri": redirect_uri
    }

    try:
        token_response = requests.post(token_url, data=payload)
       
        token_response.raise_for_status() 
        
        
        token_info = token_response.json()
        access_token = token_info.get("access_token")
        
        if not access_token:
            return JsonResponse({
                "statusCode": 401, 
                "error": "Access token not found in the response"
            })

        # Get user data using the access token
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get("https://api.intra.42.fr/v2/me", headers=headers)
        
        user_response.raise_for_status()
       


        user_data = user_response.json()
        user_info = {
            "username": user_data.get("login"),
            "email": user_data.get("email"),
            "avatar": user_data.get("image", {}).get("link"),
            "is_oauth": True
        }

        # Get or create user
        try:
            user = User.objects.get(email=user_info['email'])
            
            
            user.is_oauth = True
            user.auth_42 = True
            user.is_active = True
            user.is_first_login = False
            user.save()
            
           
            serializer = UserSerializer(instance=user)
            
        except User.DoesNotExist:
            
            new_user_serializer = UserSerializer(data=user_info)
            if not new_user_serializer.is_valid():
                return JsonResponse(new_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            user = new_user_serializer.save()
            serializer = UserSerializer(instance=user) 

        
        token = handle_token(user.id_user, user.is_2fa_enabled)
        
       
        User.objects.filter(id_user=user.id_user).update(auth_42=True)
        User.objects.filter(id_user=user.id_user).update(is_active=True)
        
       

        response = JsonResponse({
            'user': serializer.data,
            'jwt_token': token
            
        })
       
        host = request.get_host()

         
#
       

      
        
        if user.is_2fa_enabled :
            response = redirect(
            f"{base_url}{'/2fa' }", 
            permanent=True
        )
        else :

            response = redirect(
            f"{base_url}{'/game-intro1' if user.is_first_login else '/dashboard'}", 
            permanent=True
            )

          
        
    # Set the cookie
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=True
    )
    
        return response
       

    except requests.exceptions.RequestException as e:
        return JsonResponse({
            "statusCode": 400,
            "error": "Failed to complete OAuth flow",
            "details": str(e)
        })
    
class ActiveUsersListView(APIView):
    @jwt_cookie_check
    def get(self, request):
        try:
            
            current_user = get_user_by_token(request.decoded_token)
            
            
           
            friendships = Friendship.objects.filter(
                Q(id_user=current_user, status=Friendship.Status.ACCEPTED.value) |
                Q(id_friend=current_user, status=Friendship.Status.ACCEPTED.value)
            )
            
            
            # Extract the friend IDs
            friend_ids = set(
                friendship.id_friend.id_user if friendship.id_user == current_user 
                else friendship.id_user.id_user
                for friendship in friendships
            )
         
            
           
            active_users = User.objects.filter(
                id_user__in=friend_ids,
                is_active=True
            ).values(
                'id_user',
                'username',
                'avatar'
            )
         
            return Response({
                'statusCode': 200,
                'data': {
                    'active_users': list(active_users),
                    'total_active': len(active_users)
                }
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}", 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class OfflineUsersListView(APIView):
    @jwt_cookie_check
    def get(self, request):
        try:
           
            current_user = get_user_by_token(request.decoded_token)

            
           
            friendships = Friendship.objects.filter(
                Q(id_user=current_user, status=Friendship.Status.ACCEPTED.value) |
                Q(id_friend=current_user, status=Friendship.Status.ACCEPTED.value)
            )
           
            
          
            friend_ids = set(
                friendship.id_friend.id_user if friendship.id_user == current_user 
                else friendship.id_user.id_user
                for friendship in friendships
            )
            
            
          
            active_users = User.objects.filter(
                id_user__in=friend_ids,
                is_active=False
            ).values(
                'id_user',
                'username',
                'avatar'
            )
             

            return Response({
                'statusCode': 200,
                'data': {
                    'active_users': list(active_users),
                    'total_active': len(active_users)
                }
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}", 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserStatusView(APIView):
    @jwt_cookie_check
    def get(self, request):
        
        try:
            user= get_user_by_token(request.decoded_token)
           
            return Response({
                'statusCode': 200,
                'data': {
                    'username': user.username,
                    'is_active': user.is_active
                }
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}", 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LoginView(APIView):
   
    def post(self, request):
       try:
            username = request.data.get('username', '').strip()
            password = request.data.get('password', '')
            user = User.objects.filter(username=username).first()
            if not user or not user.check_password(password):
                raise AuthenticationError('Incorrect username or password')
        
            user.is_active = True
            user.save()

            token = handle_token(user.id_user, user.is_2fa_enabled)
            response = Response({'jwt': token})
            response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=True
            )
            return response

       except AuthenticationError as e:
            return create_error_response(e.message, e.status_code)

class GetUser(APIView):
    
    @jwt_cookie_check
    def get(self, request):
        try:
            user = User.objects.get(id_user=request.decoded_token['id'])
            user.created_at.date
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            raise AuthenticationError("User not found", status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
   
    @jwt_cookie_check
    def post(self, request):
        user = get_user_by_token(request.decoded_token)
            
            
        user.is_active = False
        user.save()
        response = Response({'message': 'Successfully logged out'})
        response.delete_cookie('jwt')
        return response



class Auth2Fa_Verify(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
            code = request.data.get('code')
            if not code:
                raise APIException("2FA code is required", status.HTTP_400_BAD_REQUEST)

            user = get_user_by_token(request.decoded_token)
            
            if not user.two_factor_secret:
                raise APIException(
                    "2FA secret not set for this user",
                    status.HTTP_400_BAD_REQUEST
                )
            
            if not check_2fa_code(user, code):
                raise APIException(
                    "Invalid 2FA code",
                    status.HTTP_401_UNAUTHORIZED
                )

            return Response({
                'statusCode': 200,
                'message': '2FA verification successful'
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)

class ResetProfile(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
            user = get_user_by_token(request.decoded_token)
            user.delete()
            
            response = Response()
            response.delete_cookie('jwt')
            return response

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}", 
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class OfflineUser(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
           
            user = get_user_by_token(request.decoded_token)
            
         
            user.is_active = False
            user.save()
            
            return Response({
                'statusCode': 200,
                'message': 'offline mdoe ',
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class OnUser(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
           
            user = get_user_by_token(request.decoded_token)
            
         
            user.is_active = True
            user.save()
            
            return Response({
                'statusCode': 200,
                'message': 'ONline mdoe ',
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class Enable2fa(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
           
            user = get_user_by_token(request.decoded_token)
            
         
            user.is_2fa_enabled = True
            user.save()
            
            return Response({
                'statusCode': 200,
                'message': '2FA has been enabled successfully',
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class Disabled2fa(APIView):
    @jwt_cookie_check
    def post(self, request):
        try:
           
            user = get_user_by_token(request.decoded_token)
            
         
            user.is_2fa_enabled = False
            user.save()
            
            return Response({
                'statusCode': 200,
                'message': '2FA has been disbaled successfully',
            })

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        


class Setup_2faa(APIView):
    @jwt_cookie_check
    def get(self, request):
        try:
            user = get_user_by_token(request.decoded_token)
            
            secret = setup_2fa(user)
            qr_uri = get_qrcode(user)
            qr_img = generate_qr_image(qr_uri)
            
            response = HttpResponse(qr_img)
            response['Content-Type'] = 'image/png'
            response['Content-Disposition'] = 'attachment; filename="qr_code.png"'
            return response

        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                str(e),
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RestProfile(APIView):
    
    @jwt_cookie_check
    def post(self, request):
        user = get_user_by_token(request.decoded_token)
        user.delete()
        
        response = Response({'message': 'Profile successfully reset'})
        response.delete_cookie('jwt')
        return response


class UpdateInfo (APIView ):
    @jwt_cookie_check
    def post(self,request):
        try :
            user=get_user_by_token(request.decoded_token)
    
      
            if 'nickname' not in request.data:
                raise APIException(
                    "No valid fields provided for update",
                    status.HTTP_400_BAD_REQUEST
                ) 
            if 'clan' not in request.data:
                raise APIException(
                    "No valid fields provided for update",
                    status.HTTP_400_BAD_REQUEST
                )
            update_fields = {
                'nickname': request.data['nickname'],
                'clan': request.data['clan'],
            }

           
            User.objects.filter(id_user=user.id_user).update(**update_fields)

            return Response({'message': 'Profile updated successfully', 'user': update_fields}, status=status.HTTP_200_OK)
        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LeaderBoardData(APIView):
    
    @jwt_cookie_check
    def get(self, request):
        users = User.objects.values('username', 'clan', 'xp', 'clan_logo').order_by('-xp')
        return Response(list(users))

class UpdateProfile(APIView):
    @jwt_cookie_check
    def post(self,request):
        
        try:
            
            user = get_user_by_token(request.decoded_token)
            update_fields = {}
            
            if 'username' in request.data:
                username = request.data['username']
                update_fields['username'] = username
            
          
            if 'email' in request.data:
                email = request.data['email']
                if User.objects.filter(email=email).exclude(id_user=user.id_user).exists():
                    raise APIException(
                        "Email already exists",
                        status.HTTP_400_BAD_REQUEST
                    )
                update_fields['email'] = email
            
            
            if 'password' in request.data:
                password = request.data['password']
                update_fields['password'] = make_password(password)
            if 'avatar' in request.data:
                avatar = request.data['avatar']
                
                update_fields['avatar'] = avatar

            if not update_fields:
                raise APIException(
                    "No valid fields provided for update",
                    status.HTTP_400_BAD_REQUEST
                )
            

            User.objects.filter(id_user=user.id_user).update(**update_fields)
            
            return Response({
                'statusCode': 200,
                'message': 'Profile updated successfully',
                
            })
            
        except APIException as e:
            return create_error_response(e.message, e.status_code)
        except Exception as e:
            return create_error_response(
                f"An error occurred hereee: {str(e)}",
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )