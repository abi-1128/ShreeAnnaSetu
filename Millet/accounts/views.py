from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import FarmerRegistrationForm, ConsumerRegistrationForm, CustomAuthenticationForm
from .models import User
from consumer.models import Cart

def home(request):
    return render(request, 'home.html')

def register_farmer(request):
    if request.method == 'POST':
        form = FarmerRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            # Authenticate the user after registration
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Registration successful!')
                return redirect('farmer_dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = FarmerRegistrationForm()
    return render(request, 'accounts/register_farmer.html', {'form': form})

def register_consumer(request):
    if request.method == 'POST':
        form = ConsumerRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            # Create a cart for the consumer
            Cart.objects.create(consumer=user)
            # Authenticate the user after registration
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Registration successful!')
                return redirect('consumer_dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    else:
        form = ConsumerRegistrationForm()
    return render(request, 'accounts/register_consumer.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Print debug information
        print(f"Login attempt: Username={username}")
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome back, {username}!')
            
            # Print debug information
            print(f"User authenticated: {user.username}, Type: {user.user_type}")
            
            # Redirect based on user type
            if user.user_type == 'farmer':
                return redirect('farmer_dashboard')
            elif user.user_type == 'consumer':
                return redirect('consumer_dashboard')
            else:
                return redirect('home')
        else:
            print(f"Authentication failed for username: {username}")
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'accounts/login.html')

def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('home')

@login_required
def profile(request):
    return render(request, 'accounts/profile.html')
