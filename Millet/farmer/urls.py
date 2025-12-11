from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='farmer_dashboard'),
    path('add-product/', views.add_product, name='add_product'),
    path('price-prediction/', views.price_prediction, name='price_prediction'),
    path('crop-advisory/', views.crop_advisory, name='crop_advisory'),
    path('rewards/', views.farmer_rewards, name='farmer_rewards'),
]