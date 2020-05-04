import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from api.models import Client, Notification
from django.http import HttpResponse
import stripe
from django.conf import settings
from django.core.mail import send_mail

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
    if event.type == 'invoice.created':
        invoice = event.data.object
        client = Client.objects.get(customer_id=invoice.customer)
        client.statut = 'R'
        client.save()
        info = None
        if client.iban:
            info = client.iban
        else: 
            info = client.card
        content = f'{datetime.fromtimestamp(invoice.created)} - {client.societe} - Demande de prélèvement pourble compte {info} {invoice.number}'
        notification = Notification(content=content)
        notification.save()
        send_mail('Staut Paiement', notification.content, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)
    elif event.type == 'invoice.payment_succeeded':
        print("Invoice payment succceeded")
        invoice = event.data.object
        client = Client.objects.get(customer_id=invoice.customer)
        client.statut = 'R'
        client.save()
        content = f'{datetime.fromtimestamp(invoice.created)} - {client.societe} - Retour API concernant la transaction {invoice.number} Paiement OK'
        notification = Notification(content=content)
        notification.save()
        send_mail('Staut Paiement', notification.content, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)
    if event.type == 'invoice.payment_succeeded':
        print("Invoice payment succceeded")
        invoice = event.data.object
        client = Client.objects.get(customer_id=invoice.customer)
        client.statut = 'R'
        client.save()
        content = f'{datetime.fromtimestamp(invoice.created)} - {client.societe} - Retour API concernant la transaction {invoice.number} Paiement OK'
        notification = Notification(content=content)
        notification.save()
        send_mail('Staut Paiement', notification.content, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], fail_silently=False)
    elif event.type == 'invoice.payment_failed':
        invoice = event.data['object']
        customer_id = invoice['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'N'
        client.save()
        content = f'{datetime.fromtimestamp(invoice.created)} - {client.societe} - Retour API concernant la transaction {invoice.number} Echec Paiement'
        notification = Notification(content=content)
        notification.save()
    elif event.type == 'charge.succeeded':
        print('Charge succeed')
    elif event.type == 'charge.failed':
        print('Charge failed')
    elif event.type == 'payment_intent.succeeded':
        payment_intent = event.data['object']
        customer_id = payment_intent['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'R'
        new_date = int(client.date_reglement.timestamp() + (DAYS[client.periodicite] * 24 * 3600))
        client.date_reglement = datetime.fromtimestamp(new_date)
        client.save()
        content = f'{datetime.fromtimestamp(payment_intent.created)} - {client.societe} - Retour API concernant la transaction {payment_intent.number} Echec'
        notification = Notification(content=content)
        notification.save()
    elif event.type == 'payment_intent.created':
        print('Payment intent created')
    elif event.type == 'payment_intent.payment_failed':
        payment_intent = event.data['object']
        customer_id = payment_intent['customer']
        client = Client.objects.get(customer_id=customer_id)
        client.statut = 'N'
        client.save()
        content = f'{datetime.fromtimestamp(payment_intent.created)} - {client.societe} - Retour API concernant la transaction {payment_intent.number} Echec'
        notification = Notification(content=content)
        notification.save()
    else:
        return HttpResponse(status=400)
    return HttpResponse(status=200)