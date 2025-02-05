from django.urls import path
from .views import  FriendshipRequestView,Delete_User,FriendshipListReq,AcceptFriendRequest,SearchUserView,UserAvatarUploadView,AcceptedFriendshipListView
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('search_user/', SearchUserView.as_view(), name='search_user'),
   
    
    path('friendship/request/', FriendshipRequestView.as_view(), name='friendship_request'),
    path('friendship/manage/', AcceptFriendRequest.as_view(), name='manage_friendship_request'),
    path('friendship/delete/', Delete_User.as_view(), name='delete'),
    path('friendship/listfriend/', AcceptedFriendshipListView.as_view(), name='list'),

    path('avatar/', UserAvatarUploadView.as_view(), name='user-avatar'),
    path('friendship/list_request',FriendshipListReq.as_view(),name="list")
    
    
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


