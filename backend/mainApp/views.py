from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from brooksPerfectBackend import secrets
import requests

# Create your views here.


@api_view(['POST', ])
def loginSpotify(request):
    SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=' + \
        secrets.SPOTIFY_CLIENT_ID + \
        '&response_type=code&scope=user-read-playback-state&redirect_uri=https%3A%2F%2Fwww%2Egoogle%2Eno'
    r = requests.get(SPOTIFY_AUTH_URL)
    return Response(SPOTIFY_AUTH_URL)
