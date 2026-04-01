from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserProfile, PersonalRecord
import google.generativeai as genai
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

# Gemini Configuration
genai.configure(api_key="AIzaSyDd7_CBgRbt1XMoyZEg3ytpYnI_AQK5ZTU")

# --- AUTHENTICATION ---

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
        return Response({"error": "Provide both username and password"}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# --- PROFILE & ANALYTICS (For Pie Chart) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        profile = request.user.userprofile
        w = profile.weight
        goal = profile.goal

        # --- ANALYTICAL ENGINE: Macro Calculation ---
        calories = int(w * 33) # Baseline TDEE
        
        # Logic: Based on goal, partition macros
        if goal == "Muscle Gain":
            protein_g = int(w * 2.2)
            fats_g = int((calories * 0.25) / 9)
        elif goal == "Weight Loss":
            protein_g = int(w * 1.8)
            fats_g = int((calories * 0.2) / 9)
        else: # Fitness
            protein_g = int(w * 1.5)
            fats_g = int((calories * 0.3) / 9)

        carbs_g = int((calories - (protein_g * 4 + fats_g * 9)) / 4)

        return Response({
            "username": request.user.username,
            "weight": w,
            "height": profile.height,
            "age": profile.age,
            "goal": goal,
            "calories": calories,
            "macros": [
                {"name": "Protein", "value": protein_g * 4, "grams": protein_g, "fill": "#ea580c"}, # Orange
                {"name": "Carbs", "value": carbs_g * 4, "grams": carbs_g, "fill": "#ffffff"},   # White
                {"name": "Fats", "value": fats_g * 9, "grams": fats_g, "fill": "#71717a"}     # Zinc
            ]
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
        return Response({"message": "Profile updated!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- PR TRACKING (CRUD) ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_pr(request):
    try:
        PersonalRecord.objects.create(
            user=request.user,
            exercise_name=request.data.get('exercise_name'),
            weight=float(request.data.get('weight')),
            reps=int(request.data.get('reps'))
        )
        return Response({"message": "PR Logged!"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_prs(request):
    prs = PersonalRecord.objects.filter(user=request.user).order_by('-date')
    data = [{"id": pr.id, "exercise_name": pr.exercise_name, "weight": pr.weight, "reps": pr.reps, "date": pr.date.strftime("%d %b")} for pr in prs]
    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_pr(request, pk):
    try:
        pr = PersonalRecord.objects.get(pk=pk, user=request.user)
        pr.delete()
        return Response(status=204)
    except PersonalRecord.DoesNotExist:
        return Response(status=404)

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
        return Response(status=404)

# --- AI DIET GENERATION ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_diet_plan(request):
    try:
        profile = request.user.userprofile
        prompt = f"Professional 1-day diet plan for {request.user.username}: Age {profile.age}, Weight {profile.weight}kg, Goal {profile.goal}. Include Macros."

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        diet_text = response.text

        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 18)
        p.drawString(100, 750, f"FitLift AI Plan: {request.user.username}")
        p.line(100, 745, 500, 745)

        p.setFont("Helvetica", 10)
        y = 710
        for line in diet_text.split('\n'):
            p.drawString(100, y, line.replace('*', ''))
            y -= 15
            if y < 50:
                p.showPage()
                y = 750

        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'{request.user.username}_Plan.pdf')

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def HealthCheck(request):
    return Response({"status": "FitLift Backend is Running!", "version": "1.2.0"})