from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Cart, CartItem, Order, OrderItem, FarmerAdoption, ConsumerReward
from farmer.models import Product
from accounts.models import User
from django.db.models import Sum, Count

@login_required
def dashboard(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    # Get consumer's cart
    cart, created = Cart.objects.get_or_create(consumer=request.user)
    cart_items_count = CartItem.objects.filter(cart=cart).count()
    
    # Placeholder data for demonstration
    context = {
        'cart_items_count': cart_items_count,
        'orders_count': 0,  # Will be implemented when orders are created
        'adopted_farmers_count': 0,  # Will be implemented when farmer adoptions are created
        'reward_points': 0,  # Will be implemented when rewards are created
        'recommended_products': Product.objects.all()[:4],  # Simple recommendation for now
        'recent_orders': [],  # Will be implemented when orders are created
        'adopted_farmers': [],  # Will be implemented when farmer adoptions are created
    }
    
    return render(request, 'consumer/dashboard.html', context)

@login_required
def product_list(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    products = Product.objects.filter(is_available=True)
    return render(request, 'consumer/product_list.html', {'products': products})

@login_required
def product_detail(request, product_id):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'consumer/product_detail.html', {'product': product})

@login_required
def cart(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    cart, created = Cart.objects.get_or_create(consumer=request.user)
    cart_items = CartItem.objects.filter(cart=cart)
    
    total = sum(item.product.price * item.quantity for item in cart_items)
    
    return render(request, 'consumer/cart.html', {
        'cart_items': cart_items,
        'total': total
    })

@login_required
def add_to_cart(request, product_id):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(consumer=request.user)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': 1}
    )
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    messages.success(request, f"{product.name} added to your cart.")
    return redirect('product_list')

@login_required
def checkout(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    return render(request, 'consumer/checkout.html')

@login_required
def health_advisor(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    return render(request, 'consumer/health_advisor.html')

@login_required
def farmer_adoption(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    return render(request, 'consumer/farmer_adoption.html')

@login_required
def chatbot(request):
    # Ensure user is a consumer
    if not request.user.is_consumer:
        messages.error(request, "Access denied. You are not registered as a consumer.")
        return redirect('home')
    
    return render(request, 'consumer/chatbot.html')
