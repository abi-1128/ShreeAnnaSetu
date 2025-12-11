from django.db import models
from accounts.models import User
from django.utils import timezone

class AIModel(models.Model):
    MODEL_TYPES = (
        ('price_predictor', 'Price Predictor'),
        ('crop_advisory', 'Crop Advisory'),
        ('health_advisor', 'Health Advisor'),
    )
    
    name = models.CharField(max_length=100)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.name} ({self.get_model_type_display()})"

class WeatherAlert(models.Model):
    region = models.CharField(max_length=100)
    alert_type = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.alert_type} alert for {self.region}"

class GovernmentScheme(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    eligibility = models.TextField()
    application_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    message = models.TextField()
    is_user_message = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Message from {'User' if self.is_user_message else 'AI'}: {self.message[:50]}..."
