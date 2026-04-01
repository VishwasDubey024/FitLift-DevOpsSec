from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserProfile
import google.generativeai as genai
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserProfile
from .models import UserProfile, PersonalRecord
import google.generativeai as genai
genai.configure(api_key="AIzaSyDd7_CBgRbt1XMoyZEg3ytpYnI_AQK5ZTU")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_diet_plan(request):
    try:
        profile = request.user.userprofile
        print(f"DEBUG: Generating for {request.user.username}, Goal: {profile.goal}")

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Give me a 1 day diet plan for fitness.")
        diet_text = response.text
        print("DEBUG: Gemini Response Received!")

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, f"Diet Plan for {request.user.username}")
        p.save()
        buffer.seek(0)
        
        return FileResponse(buffer, as_attachment=True, filename='diet.pdf')

    except Exception as e:
        print("CRITICAL ERROR:", str(e)) 
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_diet_plan(request):
    try:
        profile = request.user.userprofile
        prompt = f"""
        Act as a professional nutritionist. Create a 1-day detailed diet plan for:
        Name: {request.user.username}
        Age: {profile.age}
        Weight: {profile.weight}kg
        Height: {profile.height}cm
        Fitness Goal: {profile.goal}
        
        Provide Breakfast, Lunch, Evening Snack, and Dinner. 
        Include estimated calories and macros for each meal.
        Keep the tone professional and motivating.
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        diet_text = response.text

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        p.setFont("Helvetica-Bold", 20)
        p.setStrokeColorRGB(0.9, 0.3, 0)
        p.drawString(100, height - 50, "FitLift AI Personal Diet Plan")
        
        p.setFont("Helvetica-Bold", 12)
        p.drawString(100, height - 80, f"Prepared for: {request.user.username} | Goal: {profile.goal}")
        p.line(100, height - 85, 500, height - 85)

        p.setFont("Helvetica", 11)
        text_object = p.beginText(100, height - 120)
        
        lines = diet_text.split('\n')
        for line in lines:
            clean_line = line.replace('**', '').replace('*', '')
            text_object.textLine(clean_line)
            
            if text_object.getY() < 50:
                p.drawText(text_object)
                p.showPage()
                text_object = p.beginText(100, height - 50)
                p.setFont("Helvetica", 11)

        p.drawText(text_object)
        p.showPage()
        p.save()

        buffer.seek(0)
        
        return FileResponse(buffer, as_attachment=True, filename=f'{request.user.username}_DietPlan.pdf')

    except Exception as e:
        return Response({"error": f"AI Generation failed: {str(e)}"}, status=500)

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
    
    if not username or not password:
        return Response({"error": "Please provide both username and password"}, status=400)

    user = authenticate(username=username, password=password)
    
    if user:
        try:
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
        
        if 'weight' in data: profile.weight = float(data['weight'])
        if 'height' in data: profile.height = float(data['height'])
        if 'age' in data: profile.age = int(data['age'])
        if 'goal' in data: profile.goal = data['goal']
        
        profile.save()
        
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
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_pr(request):
    data = request.data
    try:
        PersonalRecord.objects.create(
            user=request.user,
            exercise_name=data.get('exercise_name'),
            weight=float(data.get('weight')),
            reps=int(data.get('reps'))
        )
        return Response({"message": "PR Logged!"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_prs(request):
    prs = PersonalRecord.objects.filter(user=request.user).order_by('-date')
    
    data = []
    for pr in prs:
        data.append({
            "id": pr.id, 
            "exercise_name": pr.exercise_name,
            "weight": pr.weight,
            "reps": pr.reps,
            "date": pr.date.strftime("%d %b")
        })
    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pr(request, pk):
    try:
        pr = PersonalRecord.objects.get(pk=pk, user=request.user)
        pr.delete()
        return Response({"message": "PR Deleted!"}, status=204)
    except PersonalRecord.DoesNotExist:
        return Response({"error": "PR not found"}, status=404)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_pr(request, pk):
    try:
        pr = PersonalRecord.objects.get(pk=pk, user=request.user)
        data = request.data
        if 'weight' in data: pr.weight = data['weight']
        if 'reps' in data: pr.reps = data['reps']
        if 'exercise_name' in data: pr.exercise_name = data['exercise_name']
        pr.save()
        return Response({"message": "PR Updated!"})
    except PersonalRecord.DoesNotExist:
        return Response({"error": "PR not found"}, status=404)