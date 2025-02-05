from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utlis import validate_jwt
from django.http import JsonResponse

from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Friendship,User

from .decorators import get_user
from .decorators import jwt_cookie_check
from ft_42auth.serializers import UserSerializer
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils.decorators import method_decorator
import os
import urllib.parse
from PIL import Image
from django.core.files.base import ContentFile
from django.db.models import F



#def run_on_startup():






           

class SearchUserView(APIView):
    def get(self, request):
        
        search_query = request.query_params.get('username', None)
        
        if not search_query:
            return Response({"status": "error", "message": "No search term provided"}, status=status.HTTP_400_BAD_REQUEST)
        
       
        users = User.objects.filter(username__icontains=search_query)
        
        
        if users:
            serializer = UserSerializer(users, many=True)
            return Response({"status": "success", "users": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "message": "No users found"}, status=status.HTTP_404_NOT_FOUND)
class UserAvatarUploadView(APIView):
    def post(self, request):
        try:
            user_id = request.decoded_token['id']
            file_obj = request.FILES['avatar']

            image = Image.open(file_obj)
           
            if image.format not in settings.ALLOWED_IMAGE_FORMATS:
                return Response({
                    "status": 400,
                    "message": f"Invalid file format. Allowed formats: {settings.ALLOWED_IMAGE_FORMATS}"
                })

           
            file_obj.seek(0)
            filename = default_storage.save(file_obj.name, ContentFile(file_obj.read()))

            host = request.get_host()
            publicc=f"https://{host}:8443"
            

            file_url = urllib.parse.urljoin(
                publicc,
                os.path.join(settings.MEDIA_URL, filename)
            )
          
            

      

            # Update user model
            player = User.objects.get(id_user=user_id)
            player.avatar = file_url
            player.save()

            return Response({
                "status": 200,
                "message": "Avatar updated successfully",
                "avatar_url": file_url,
            })
        except User.DoesNotExist:
            return Response({
                "status": 404,
                "message": "User not found",
            })
        except Exception as e:
            return Response({
                "status": 500,
                "message": str(e),
            })
   
class FriendshipListReq(APIView):
 
    def get(self, request):
        user_id = request.decoded_token.get('id')
        if not user_id:
            return Response({
                "status": "error",
                "message": "Invalid token or user not authenticated"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get pending friendship requests
        pending_requests = Friendship.objects.filter(
            id_friend_id=user_id,
            status="PN"
        ).annotate(
            requester_id=F('id_user__id_user'),
            requester_username=F('id_user__username')
        ).values(
            'id_friendship',
            'requester_id',
            'requester_username'
        )

        if not pending_requests.exists():
            return Response({
                "status": "success",
                "message": "No pending friend requests",
                "list_of_requests": []
            }, status=status.HTTP_200_OK)

        response_data = [{
            "id_friendship": request["id_friendship"],
            "id_user": request["requester_id"],
            "username": request["requester_username"]
        } for request in pending_requests]

        return Response({
            "status": "success",
            "message": "Friend requests retrieved successfully",
            "list_of_requests": response_data
        }, status=status.HTTP_200_OK)
    
class AcceptedFriendshipListView(APIView):
    def get(self, request):
        user_id = request.decoded_token.get('id')
        
     
        if not user_id:
            return Response({
                "status": "error",
                "message": "Invalid token or user not authenticated"
            }, status=status.HTTP_400_BAD_REQUEST)

        
        accepted_friendships = Friendship.objects.filter(
            id_friend_id=user_id,
            status="AC"
        ).annotate(
            requester_id=F('id_user__id_user'),       
            requester_username=F('id_user__username'), 
            requester_avatar=F('id_user__avatar')      
        ).values(
            'id_friendship',
            'requester_id',
            'requester_username',
            'requester_avatar'
        )

     
        if not accepted_friendships.exists():
            return Response({
                "status": "success",
                "message": "No accepted friends found",
                "list_of_requests": []
            }, status=status.HTTP_200_OK)

       
        response_data = [{
            "id_friendship": friend["id_friendship"],
            "id_user": friend["requester_id"],
            "username": friend["requester_username"],
            "avatar": friend["requester_avatar"]
        } for friend in accepted_friendships]

        return Response({
            "status": "success",
            "message": "Accepted friendships retrieved successfully",
            "list_of_requests": response_data
        }, status=status.HTTP_200_OK)


class FriendshipRequestView(APIView):

    #Managing Friend Requests    
    
    def post(self, request):
        
        playload=request.decoded_token
        ## here we get the id 
        current_user_id =playload['id']

        # the sender
        from_id = request.data.get('from_id')
        if not from_id:
             return Response({"status": "error", "message": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        # ## Get id from Object
        try:
            from_id = int(from_id)
        except (ValueError, TypeError):
            return Response({
                "status": "error", 
                "message": "Invalid ID format"
            }, status=status.HTTP_400_BAD_REQUEST)
        if current_user_id == from_id:
            return Response({
                "status": "error", 
                "message": "You can't send friend request to yourself"
            }, status=status.HTTP_400_BAD_REQUEST)

        sender = get_user(current_user_id)
      
        if sender is None:
             return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        recipient =get_user(from_id)
        
        
        
        if recipient is None:
             return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)        
      
        
        ## create friendship and check if  that exit or not
        
        
        friendship_exists = Friendship.objects.filter(id_user=sender, id_friend=recipient).exists()
        if friendship_exists :
            return Response({"status": "error", "message": "Friendship request already sent"}, status=status.HTTP_400_BAD_REQUEST)    
        
        
        Friendship.objects.create(id_user=sender, id_friend=recipient, status='PN')

        return Response({"status": "success", "message": "Friendship request sent"})
    

 
class AcceptFriendRequest(APIView):
    
    def post(self, request):
        playload=request.decoded_token
        ## here we get the id
        current_user_id =playload['id']
        from_id = request.data.get('from_id')

        if not from_id:
            return Response({"status": "error", "message": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

       
        sender = get_user(from_id)
        recipient = get_user(current_user_id)

        if sender is None or recipient is None:
            return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
        friendship = Friendship.objects.filter(id_user=sender, id_friend=recipient, status='PN').first()

        if not friendship:
            return Response({"status": "error", "message": "Friendship request not found"}, status=status.HTTP_404_NOT_FOUND)

        
        friendship.status = 'AC'
        friendship.save()

        return Response({"status": "success", "message": "Friendship request accepted"})
    
    def delete(self, request):
        payload = request.decoded_token
        current_user_id = payload['id']
        from_id = request.data.get('from_id')

        if not from_id:
            return Response({"status": "error", "message": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        sender = get_user(from_id)
        recipient = get_user(current_user_id)

        if sender is None or recipient is None:
            return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        
        friendship = Friendship.objects.filter(id_user=sender, id_friend=recipient, status='PN').first()

        if not friendship:
            return Response({"status": "error", "message": "Friendship request not found"}, status=status.HTTP_404_NOT_FOUND)

        
        friendship.delete()
        return Response({"status": "success", "message": "Friendship request deleted"})
        


 
class Delete_User(APIView):
    
  
    def post(self, request):
        payload = request.decoded_token
        current_user_id = payload['id']
        from_id = request.data.get('from_id')

        if not from_id:
            return Response({"status": "error", "message": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        sender = get_user(from_id)
        recipient = get_user(current_user_id)

        if sender is None or recipient is None:
            return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        
        friendship = Friendship.objects.filter(id_user=sender, id_friend=recipient, status='PN').first()

        if not friendship:
            return Response({"status": "error", "message": "Friendship request not found"}, status=status.HTTP_404_NOT_FOUND)

      
        friendship.delete()
        return Response({"status": "success", "message": "Friendship request deleted"})
        