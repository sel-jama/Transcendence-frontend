from django.urls import path
from .views import RegisterView ,OnUser,Enable2fa,Sign42View,Disabled2fa,OfflineUser,intra_callback_auth,UpdateInfo,UserStatusView,OfflineUsersListView ,ActiveUsersListView,LogoutView,UpdateProfile,RestProfile,LoginView,GetUser,LeaderBoardData,Auth2Fa_Verify,Setup_2faa
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView

urlpatterns = [
    path('token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh',TokenRefreshView.as_view(),name='token_refresh'),
    path('register/',RegisterView.as_view(),name="register"),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', GetUser.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),
    #path('auth-check/',auth_check,name="auth_check"),
    path('auth42/', Sign42View.as_view(), name='auth42'),
    path('leadrboard',LeaderBoardData.as_view(),name="boarddata"),
    path('restprofile',RestProfile.as_view(),name="restprofile"),
    path('2fa/verify',Auth2Fa_Verify.as_view(),name="2fa_verify"),
    path('2fa/setup',Setup_2faa.as_view(),name="2fa_setup"),
    path('update/',UpdateProfile.as_view(),name="update"),
    path('updateinfo/' ,UpdateInfo.as_view(),name="updatedata"),
    path('accounts/42/login/callback/', intra_callback_auth, name='intra_callback'),
    path('is_active/',UserStatusView.as_view(),name="active"),
    path('list_active/',ActiveUsersListView.as_view(),name="active"),
    path('list_offline/',OfflineUsersListView.as_view(),name="active"),
    path('2fa/enable',Enable2fa.as_view(),name="2fa_enable"),
    path('2fa/disable',Disabled2fa.as_view(),name="disbal"),
    path('offline',OfflineUser.as_view(),name="off"),
    path('online',OnUser.as_view(),name="ON")
    

]
