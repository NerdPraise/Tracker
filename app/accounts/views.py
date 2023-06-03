from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model

from api.serializer.accounts import UserSerializer

User = get_user_model()


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        data = request.data

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            data = {
                'user': serializer.data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
            return Response({'data': data}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class MeAPIView(views.APIView):
    serializer_class = UserSerializer

    def get(self, request):
        user = self.request.user
        if user.id is not None:
            serializer = self.serializer_class(user)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'No user logged in'}, status=status.HTTP_400_BAD_REQUEST)
