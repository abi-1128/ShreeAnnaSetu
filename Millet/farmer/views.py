from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Product, CropAdvisory, FarmerReward
from accounts.models import User
from django.db.models import Sum, Count

@login_required
def dashboard(request):
    # Ensure user is a farmer
    if not request.user.is_farmer:
        messages.error(request, "Access denied. You are not registered as a farmer.")
        return redirect('home')
    
    # Get farmer's products
    products = Product.objects.filter(farmer=request.user)
    
    # Get stats
    products_count = products.count()
    
    # Placeholder data for demonstration
    context = {
        'products': products,
        'products_count': products_count,
        'orders_count': 0,  # Will be implemented when orders are created
        'revenue': 0,  # Will be implemented when orders are created
        'reward_points': 0,  # Will be implemented when rewards are created
        'weather_alerts': [],  # Will be implemented with weather API
        'schemes': [],  # Will be implemented with government schemes data
        'recent_orders': [],  # Will be implemented when orders are created
    }
    
    return render(request, 'farmer/dashboard.html', context)

@login_required
def add_product(request):
    # Ensure user is a farmer
    if not request.user.is_farmer:
        messages.error(request, "Access denied. You are not registered as a farmer.")
        return redirect('home')
    
    if request.method == 'POST':
        # Process form submission (will be implemented)
        messages.success(request, "Product added successfully!")
        return redirect('farmer_dashboard')
    
    return render(request, 'farmer/add_product.html')

@login_required
def price_prediction(request):
    # Ensure user is a farmer
    if not request.user.is_farmer:
        messages.error(request, "Access denied. You are not registered as a farmer.")
        return redirect('home')
    
    return render(request, 'farmer/price_prediction.html')

@login_required
def crop_advisory(request):
    # Ensure user is a farmer
    if not request.user.is_farmer:
        messages.error(request, "Access denied. You are not registered as a farmer.")
        return redirect('home')
    
    return render(request, 'farmer/crop_advisory.html')

@login_required
def farmer_rewards(request):
    # Ensure user is a farmer
    if not request.user.is_farmer:
        messages.error(request, "Access denied. You are not registered as a farmer.")
        return redirect('home')
    
    return render(request, 'farmer/rewards.html')
