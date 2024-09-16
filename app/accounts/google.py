import requests
from django.core.exceptions import ValidationError

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def get_user_google_info(data):
    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not response.ok:
        print(response.json())
        raise ValidationError("Failed to obtain access token from Google.")
    access_token = response.json()["access_token"]

    response = requests.get(GOOGLE_USER_INFO_URL, params={"access_token": access_token})

    if not response.ok:
        raise ValidationError("Failed to obtain user info from Google.")

    return response.json()
