from django.conf import settings
from django.core.exceptions import ValidationError
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from api.serializer.accounts import ChangePasswordSerializer, UserProfileSerializer, UserSerializer
from app.accounts.models import User, UserProfile

from .google import get_user_google_info


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        data = request.data

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                "user": serializer.data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
            return Response({"data": data}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request):
        user = self.get_object()
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        if not user.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.data.get("new_password"))
        user.save()
        response = {
            "status": "success",
            "code": status.HTTP_200_OK,
            "message": "Password updated successfully",
        }
        return Response(response)


class MeAPIView(generics.RetrieveAPIView, generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserProfile.objects.all()

    def get_object(self):
        return self.request.user.userprofile


class GoogleLoginAPIView(views.APIView):
    def post(self, request):
        data = request.data

        code = data.get("code", None)
        if not code:
            return Response({"errors": "Invalid google login"}, status=400)

        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        }

        try:
            response = get_user_google_info(data)
        except ValidationError as e:
            return Response({"errors": e.message}, status=400)

        email = response["email"]
        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            username = response["email"].split("@")[0]
            first_name = response.get("given_name", "")
            last_name = response.get("family_name", "")

            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
            )
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=200,
        )
