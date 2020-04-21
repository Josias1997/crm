from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Client
from rest_framework.response import Response
from .helpers import generate_client_url, send_url_to_client
import stripe
from datetime import datetime
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json

stripe.api_key = settings.SECRET_API_KEY
product = stripe.Product.retrieve(settings.PRODUCT_ID)

DAYS = {
    'H': 7,
    'M': 30,
    'T': 90,
    'S': 180,
    'A': 365
}

# Create your views here.
@api_view(['POST'])
def add_client(request):
    """
        @params: None
        @return: {id, societe}
        @desc: Add client to database
    """
    email = request.data['email']
    if Client.objects.filter(email=email).exists():
        return Response({
            'error': 'Cet email existe déjà'
        })
    societe = request.data['societe']
    date = request.data['date_reglement'].split('-')
    date_reglement = datetime(int(date[0]), int(date[1]), int(date[2]))
    periodicite = request.data['periodicite']
    montant = int(request.data['montant'])
    mode_de_reglement = request.data['mode_de_reglement']
    statut = request.data['statut']
    statut_client = request.data['statut_client']
    client = Client(societe=societe, email=email, date_reglement=date_reglement, periodicite=periodicite, montant=montant,
    mode_de_reglement=mode_de_reglement, statut=statut, statut_client=statut_client)
    client.save()
    send_url_to_client(generate_client_url(client.societe, client.id, client.token))
    return Response({
        'id': client.id,
        'societe': client.societe,
        'error': False
    })


@api_view(['GET'])
def get_clients(request):
    """ 
        @params: None
        @return: Array[] Clients
        @desc: Retrive all clients
    """
    return Response({
        'clients': serialize('json', Client.objects.all())
    })


@api_view(['GET'])
def get_client(request, pk):
    """
        @params: id
        @return: Client
        @desc: Retrieve client by id
    """
    client = Client.objects.get(id=pk)
    autorisation_prelevement = 'null'
    if client.autorisation_prelevement:
        autorisation_prelevement = client.autorisation_prelevement.url
    client_details = {
        'societe': client.societe,
        'email': client.email,
        'date_reglement': client.date_reglement,
        'periodicite': client.periodicite,
        'montant': client.montant,
        'mode_de_reglement': client.mode_de_reglement,
        'statut': client.statut,
        'statut_client': client.statut_client,
        'iban': client.iban,
        'autorisation_prelevement': autorisation_prelevement
    }
    return Response({
        'client': client_details
    })


@api_view(['PUT'])
def update_client(request, pk):
    """
        @params: id
        @return: Client
        @desc: Update client
    """
    client = Client.objects.get(id=pk)
    client.email = request.data['email']
    client.societe = request.data['societe']
    date = request.data['date_reglement'].split('-')
    client.date_reglement = datetime(int(date[0]), int(date[1]), int(date[2]))
    client.periodicite = request.data['periodicite']
    client.montant = int(request.data['montant'])
    client.mode_de_reglement = request.data['mode_de_reglement']
    client.statut = request.data['statut']
    client.statut_client = request.data['statut_client']
    client.iban = request.data['iban']
    client.save()
    autorisation_prelevement = 'null'
    if client.autorisation_prelevement:
        autorisation_prelevement = client.autorisation_prelevement.url
    client_details = {
        'societe': client.societe,
        'email': client.email,
        'date_reglement': client.date_reglement,
        'periodicite': client.periodicite,
        'montant': client.montant,
        'mode_de_reglement': client.mode_de_reglement,
        'statut': client.statut,
        'statut_client': client.statut_client,
        'iban': client.iban,
        'autorisation_prelevement': autorisation_prelevement
    }
    return Response({
        'client': client_details
    })


@api_view(['DELETE'])
def delete_client(request, pk):
    """
        @params: id
        @return: String Message
        @desc: Delete client
    """
    client = Client.objects.get(id=pk)
    client.delete()
    return Response({
        'message': 'success'
    })


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def update_iban(request):
    """
        @params: None
        @return: String Message
        @desc: Update Iban and set Stripe Subscription for the client
    """
    pk = request.data['id']
    token = request.data['token']
    autorisation_prelevement = request.data['autorisation_prelevement']
    payment_method_id = request.data['payment_method']
    client = Client.objects.get(Q(id=pk) & Q(token=token))
    if not client.subscription_id:
        payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
        client.autorisation_prelevement = autorisation_prelevement
        client.statut_client = 'A'
        client.iban = f'{payment_method.sepa_debit.country}{payment_method.sepa_debit.bank_code}*******{payment_method.sepa_debit.last4}'
        plan = None
        montant = int(client.montant) * 100
        if client.periodicite == 'H':
            plan = stripe.Plan.create(
                amount=montant,
                currency='eur',
                interval='week',
                product=product.id
            )
        elif client.periodicite == 'M':
            plan = stripe.Plan.create(
                amount=montant,
                currency='eur',
                interval='month',
                product=product.id
            )
        elif client.periodicite == 'T':
            plan = stripe.Plan.create(
                amount=montant,
                currency='eur',
                interval='month',
                interval_count=3,
                product=product.id
            )
        elif client.periodicite == 'S':
            plan = stripe.Plan.create(
                amount=montant,
                currency='eur',
                interval='month',
                interval_count=6,
                product=product.id
            )
        elif client.periodicite == 'A':
            plan = stripe.Plan.create(
                amount=montant,
                currency='eur',
                interval='year',
                product=product.id
            )
        customer = stripe.Customer.create(
            email=client.email,
            payment_method=payment_method.id,
            invoice_settings={
                'default_payment_method': payment_method.id
            }
        )
        billing_cycle_anchor = int(client.date_reglement.timestamp() + (DAYS[client.periodicite] * 24 * 3600)) 
        trial_end = int(client.date_reglement.timestamp() + (DAYS[client.periodicite] * 24 * 3600) - (24 * 3600))
        subscription = stripe.Subscription.create(
            customer=customer.id,
            items=[
                {
                    'plan': plan.id
                }
            ],
            expand=['latest_invoice.payment_intent'],
            trial_end=trial_end,
            billing_cycle_anchor=billing_cycle_anchor
        )
        client.date_reglement = datetime.fromtimestamp(billing_cycle_anchor)
        client.customer_id = customer.id
        client.plan_id = plan.id
        client.subscription_id = subscription.id
        client.save()
        return Response({
            'message': 'Iban ajouté avec succès'
        })
    else:
        return Response({
            'message': 'Vos informations ont déjà été prises en compte'
        })
    
            
        
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