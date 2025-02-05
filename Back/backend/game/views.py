from django.shortcuts import render
from django.http import JsonResponse
from .models import Room
from django.db import models
import uuid

# Create your views here.

def lobby(request):
    return render(request, 'game/lobby.html')

def waiting(request):
    # room = Room.objects.get(room_id=room_id)
    return render(request, 'game/game.html')

def pre_offline(request):
    # room = Room.objects.get(room_id=room_id)
    return render(request, 'game/pre_game_offline.html')

def pre_offline_tournament(request):
    # room = Room.objects.get(room_id=room_id)
    return render(request, 'game/pre_tournament_offline.html')

def offline(request):
    # room = Room.objects.get(room_id=room_id)
    return render(request, 'game/game_offline.html')

def play(request, room_id):
    # room = Room.objects.get(room_id=room_id)
    return render(request, 'game/play.html', {'room': room_id})
