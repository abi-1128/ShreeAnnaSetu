from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/farmer/', views.register_farmer, name='register_farmer'),
    path('register/consumer/', views.register_consumer, name='register_consumer'),
    path('profile/', views.profile, name='profile'),
]