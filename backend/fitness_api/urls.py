from django.urls import path
from .views import HealthCheck, get_user_profile 

urlpatterns = [
    path('health/', HealthCheck, name='health_check'),
    path('profile/', get_user_profile, name='user_profile'), 
]