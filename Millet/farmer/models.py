from django.db import models
from accounts.models import User
from django.utils import timezone

class Product(models.Model):
    CATEGORY_CHOICES = (
        ('grain', 'Grain'),
        ('flour', 'Flour'),
        ('snack', 'Snack'),
        ('ready_to_eat', 'Ready to Eat'),
        ('other', 'Other'),
    )
    
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_organic = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class CropAdvisory(models.Model):
    MILLET_TYPES = (
        ('pearl', 'Pearl Millet (Bajra)'),
        ('finger', 'Finger Millet (Ragi)'),
        ('foxtail', 'Foxtail Millet'),
        ('proso', 'Proso Millet'),
        ('kodo', 'Kodo Millet'),
        ('barnyard', 'Barnyard Millet'),
        ('little', 'Little Millet'),
        ('sorghum', 'Sorghum (Jowar)'),
        ('other', 'Other Millet'),
    )
    
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_advisories')
    millet_type = models.CharField(max_length=20, choices=MILLET_TYPES)
    region = models.CharField(max_length=100)
    soil_type = models.CharField(max_length=100)
    season = models.CharField(max_length=50)
    advisory_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Advisory for {self.get_millet_type_display()} in {self.region}"

class FarmerReward(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farmer_rewards')
    points = models.PositiveIntegerField(default=0)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.farmer.username}: {self.points} points"
