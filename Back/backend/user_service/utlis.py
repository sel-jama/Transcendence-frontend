# In user_service/utils.py

import requests
from django.conf import settings

def validate_jwt(token):
    headers = {"Authorization": f"Bearer {token}"}
    auth_url = f"{settings.backend_URL}/api/auth-check/"
    response = requests.get(auth_url, headers=headers)
    if response.status_code == 200:
        return response.json()  # Return user data if JWT is valid
    return None  # Return None if JWT is invalid
