from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    weight = models.FloatField()  
    height = models.FloatField()
    goal = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.user.username