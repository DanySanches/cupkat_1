from django.urls import path
from .views import bot

app_name = "bot"

urlpatterns = [
    path('', bot, name='bot'),
]