from django.urls import path
from . import views
from . import login
from . import messages
from . import clients

app_name = 'api'

urlpatterns = [
    path('data/', views.GetData.as_view()),
    path('actions/', views.GetData.as_view()),
    path('analytics/', views.GetData.as_view()),
    path('login/', login.GetData.as_view()),
    path('messages/', messages.MessagesView.as_view()),
    path('clients/', clients.GetData.as_view()),
]
