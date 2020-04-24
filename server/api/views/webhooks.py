import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from api.models import Client
from django.http import HttpResponse
import stripe

@csrf_exempt
@api_view(['POST'])
def webhooks_view(request):
    """
        @params: None
        @return: HttpResponse
        @desc: Listen to Stripe events in order to take further actions

    """
    payload = request.body
    event = None

    try:
        event = stripe.Event.construct_from(
            json.loads(payload), stripe.api_key
        )
    except ValueError as e:
        return HttpResponse(status=400)

    #Handle Event
    if event.type == 'invoice.payment_succeeded':
        print("Invoice payment succceeded")
    elif event.type == 'invoice.payment_failed':
        customer_id = event.data['object']['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'N'
        client.save()
    elif event.type == 'charge.succeeded':
        print('Charge succeed')
    elif event.type == 'charge.failed':
        print('Charge failed')
    elif event.type == 'payment_intent.succeeded':
        customer_id = event.data['object']['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'R'
        new_date = int(client.date_reglement.timestamp() + (DAYS[client.periodicite] * 24 * 3600))
        client.date_reglement = datetime.fromtimestamp(new_date)
        client.save()
    elif event.type == 'payment_intent.created':
        print('Payment intent created')
    elif event.type == 'payment_intent.payment_failed':
        customer_id = event.data['object']['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'N'
        client.save()
    else:
        return HttpResponse(status=400)
    return HttpResponse(status=200)