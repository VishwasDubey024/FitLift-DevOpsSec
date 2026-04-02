from django.urls import path

from .views import (HealthCheck, add_pr, delete_pr, edit_pr,
                    generate_diet_plan, get_user_profile, get_user_prs,
                    login_user, register_user, update_user_profile)

urlpatterns = [
    path("health/", HealthCheck, name="health_check"),
    path("profile/", get_user_profile, name="user_profile"),
    path("profile/update/", update_user_profile, name="profile_update"),
    path("register/", register_user, name="register_user"),
    path("login/", login_user, name="login_user"),
    path("add-pr/", add_pr, name="add-pr"),
    path("get-prs/", get_user_prs, name="get-prs"),
    path("generate-diet/", generate_diet_plan, name="generate-diet"),
    path("delete-pr/<int:pk>/", delete_pr, name="delete-pr"),
    path("edit-pr/<int:pk>/", edit_pr, name="edit-pr"),
]
