from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('farmer', 'Farmer'),
        ('consumer', 'Consumer'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    # Additional fields for Consumer
    age = models.PositiveIntegerField(blank=True, null=True)
    health_preferences = models.TextField(blank=True, null=True)
    
    # Additional fields for Farmer
    farm_location = models.CharField(max_length=255, blank=True, null=True)
    farm_size = models.FloatField(blank=True, null=True)
    
    def is_farmer(self):
        return self.user_type == 'farmer'
    
    def is_consumer(self):
        return self.user_type == 'consumer'
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"
