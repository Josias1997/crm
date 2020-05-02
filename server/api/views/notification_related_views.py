from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.serializers import serialize
from api.models import Notification


@api_view(['GET'])
def get_notifications(request):
	return Response({
		'notifications': serialize('json', Notification.objects.all())
	})