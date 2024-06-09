from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from .serializers import MessageSerializer

class MessagesView(APIView):
    def get(self, request):

        messages = Message.objects.all()

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data)

    def post(self, request):

        print("Received data:", request.data)
    

        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


