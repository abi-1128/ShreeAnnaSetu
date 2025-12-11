from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='consumer_dashboard'),
    path('products/', views.product_list, name='product_list'),
    path('products/<int:product_id>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart, name='cart'),
    path('add-to-cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('farmer-adoption/', views.farmer_adoption, name='farmer_adoption'),
    path('health-advisor/', views.health_advisor, name='health_advisor'),
    path('chatbot/', views.chatbot, name='chatbot'),
]