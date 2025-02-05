from django.urls import path

from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    # path('create-room/', views.create_room, name='create_room'),
    path('waiting/', views.waiting, name='waiting'),
    path('play/<str:room_id>/', views.play, name='play'),

    path('pre_offline/', views.pre_offline, name='offline'),
    path('offline/', views.offline, name='offline'),

    path('pre_offline_tournament/', views.pre_offline_tournament, name='offline_tournament'),
]
