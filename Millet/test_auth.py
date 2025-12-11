import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shreeanna_connect.settings')
django.setup()

from django.contrib.auth import authenticate
from accounts.models import User

def test_authentication():
    # Test user creation
    try:
        # Delete test user if exists
        User.objects.filter(username='testuser').delete()
        
        # Create a test user
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            user_type='farmer',
            first_name='Test',
            last_name='User',
            phone_number='1234567890'
        )
        print(f"✅ Test user created successfully: {user.username}, type: {user.user_type}")
        
        # Test authentication
        auth_user = authenticate(username='testuser', password='testpassword123')
        if auth_user:
            print(f"✅ Authentication successful for user: {auth_user.username}")
        else:
            print("❌ Authentication failed")
            
        # Test wrong password
        wrong_auth = authenticate(username='testuser', password='wrongpassword')
        if not wrong_auth:
            print("✅ Authentication correctly failed with wrong password")
        else:
            print("❌ Authentication incorrectly succeeded with wrong password")
            
    except Exception as e:
        print(f"❌ Error during test: {str(e)}")
    finally:
        # Clean up
        User.objects.filter(username='testuser').delete()
        print("🧹 Test cleanup completed")

if __name__ == "__main__":
    print("🔍 Starting authentication test...")
    test_authentication()
    print("✅ Authentication test completed")