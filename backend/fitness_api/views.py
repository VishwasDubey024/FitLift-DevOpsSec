from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserProfile

@api_view(['GET'])
@permission_classes([AllowAny])
def HealthCheck(request):
    return Response({
        "status": "FitLift Backend is Running!",
        "version": "1.1.0"
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        if User.objects.filter(username=data.get('username')).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data.get('username'),
            password=data.get('password'),
            email=data.get('email', '')
        )
        
        # Data conversion safety (500 error se bachne ke liye)
        UserProfile.objects.create(
            user=user,
            age=int(data.get('age', 25)),
            weight=float(data.get('weight', 70.0)),
            height=float(data.get('height', 170.0)),
            goal=data.get('goal', 'Fitness')
        )
        return Response({"message": "Registration Successful"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # 1. Validation
    if not username or not password:
        return Response({"error": "Please provide both username and password"}, status=400)

    user = authenticate(username=username, password=password)
    
    if user:
        try:
            # 2. Token generation safety
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Token system error: " + str(e)}, status=500)
            
    return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        profile = request.user.userprofile
        return Response({
            "username": request.user.username,
            "weight": profile.weight,
            "height": profile.height,
            "age": profile.age,
            "goal": profile.goal
        })
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    try:
        profile = request.user.userprofile
        data = request.data
        
        # Safely update fields
        if 'weight' in data: profile.weight = float(data['weight'])
        if 'height' in data: profile.height = float(data['height'])
        if 'age' in data: profile.age = int(data['age'])
        if 'goal' in data: profile.goal = data['goal']
        
        profile.save()
        
        # BMI Auto-calculation for response
        bmi = 0
        if profile.height > 0:
            bmi = round(profile.weight / ((profile.height/100)**2), 1)

        return Response({
            "message": "Profile updated!",
            "weight": profile.weight,
            "bmi": bmi
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Update failed: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)