from django.urls import path
from .views import HealthCheck, get_user_profile 
from .views import HealthCheck, get_user_profile, register_user, login_user

urlpatterns = [
    path('health/', HealthCheck, name='health_check'),
    path('profile/', get_user_profile, name='user_profile'), 
    path('register/', register_user, name='register_user'), 
    path('login/', login_user, name='login_user'),
]