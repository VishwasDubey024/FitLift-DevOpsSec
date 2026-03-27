from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response

@api_view(['GET'])
def HealthCheck(request):
    return Response({"status": "Online", "message": "FitLift API is running"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        user = request.user
        profile = user.profile 
        return Response({
            "name": user.username,
            "weight": profile.weight,
            "height": profile.height,
            "age": profile.age,
            "gender": profile.gender,
            "goal": profile.fitness_goal
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)