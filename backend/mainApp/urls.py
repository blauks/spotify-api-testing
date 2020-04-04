from django.urls import path
from .views import (loginSpotify, )

app_name = "main"

urlpatterns = [
    path('loginSpotify', loginSpotify, name="loginspotify"),

]
