from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User

class FarmerRegistrationForm(UserCreationForm):
    phone_number = forms.CharField(max_length=15, required=True)
    farm_location = forms.CharField(max_length=255, required=True)
    farm_size = forms.FloatField(required=False)
    user_type = forms.CharField(widget=forms.HiddenInput(), initial='farmer')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'farm_location', 'farm_size', 'profile_picture', 'password1', 'password2', 'user_type']
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = self.cleaned_data.get('user_type', 'farmer')
        user.phone_number = self.cleaned_data.get('phone_number')
        user.farm_location = self.cleaned_data.get('farm_location')
        user.farm_size = self.cleaned_data.get('farm_size')
        if commit:
            user.save()
        return user

class ConsumerRegistrationForm(UserCreationForm):
    phone_number = forms.CharField(max_length=15, required=True)
    age = forms.IntegerField(required=True)
    health_preferences = forms.CharField(widget=forms.Textarea, required=False)
    user_type = forms.CharField(widget=forms.HiddenInput(), initial='consumer')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'age', 'health_preferences', 'profile_picture', 'password1', 'password2', 'user_type']
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = self.cleaned_data.get('user_type', 'consumer')
        user.phone_number = self.cleaned_data.get('phone_number')
        user.age = self.cleaned_data.get('age')
        user.health_preferences = self.cleaned_data.get('health_preferences')
        if commit:
            user.save()
        return user

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))