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

class PersonalRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_name = models.CharField(max_length=100)
    weight = models.FloatField()
    reps = models.IntegerField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.exercise_name}"