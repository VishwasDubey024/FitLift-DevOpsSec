from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    height = models.FloatField(default=0.0)  
    weight = models.FloatField(default=0.0)  
    age = models.IntegerField(default=18)
    
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')

    GOAL_CHOICES = [
        ('loss', 'Weight Loss'),
        ('gain', 'Muscle Gain'),
        ('endurance', 'Endurance'),
    ]
    fitness_goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='gain')

    def __str__(self):
        return f"{self.user.username}'s Profile"