from django.shortcuts import render
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from api.models import Client
from rest_framework.response import Response
from api.helpers import generate_client_url, send_url_to_client
import stripe
from datetime import datetime
from django.core.serializers import serialize
from django.db.models import Q
from django.contrib.auth.hashers import check_password, make_password



stripe.api_key = settings.SECRET_API_KEY

DAYS = {
    'H': 7,
    'M': 30,
    'T': 90,
    'S': 180,
    'A': 365
}

INTERVALS = {
    'H': 'week',
    'M': 'month',
    'T': 'month',
    'S': 'month',
    'A': 'year'
}

INTERVALS_COUNT = {
    'H': 1,
    'M': 1,
    'T': 3,
    'S': 6,
    'A': 1
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
    product_id = request.data['product']
    plan_id = request.data['plan']
    client = Client(societe=societe, email=email, date_reglement=date_reglement, periodicite=periodicite, montant=montant,
    mode_de_reglement=mode_de_reglement, statut=statut, statut_client=statut_client, product_id=product_id, plan_id=plan_id)
    client.password = make_password(societe)
    client.save()
    send_url_to_client(generate_client_url(client.societe, client.id, client.token), client.email, client.societe)
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
        'password': client.password,
        'date_reglement': client.date_reglement,
        'periodicite': client.periodicite,
        'montant': client.montant,
        'mode_de_reglement': client.mode_de_reglement,
        'statut': client.statut,
        'statut_client': client.statut_client,
        'iban': client.iban,
        'card_info': client.card_info,
        'product_id': client.product_id,
        'plan_id': client.plan_id,
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
    client.product_id = request.data['product_id']
    client.plan_id = request.data['plan_id']
    client.save()
    autorisation_prelevement = 'null'
    if client.autorisation_prelevement:
        autorisation_prelevement = client.autorisation_prelevement.url
    client_details = {
        'societe': client.societe,
        'email': client.email,
        'password': client.password,
        'date_reglement': client.date_reglement,
        'periodicite': client.periodicite,
        'montant': client.montant,
        'mode_de_reglement': client.mode_de_reglement,
        'statut': client.statut,
        'statut_client': client.statut_client,
        'iban': client.iban,
        'card_info': client.card_info,
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
def login_client(request, pk):
    email = request.data['email']
    client = Client.objects.filter(Q(id=pk) & Q(email=email))
    if len(client) != 0:
        client = client[0]
        if client.statut_client != 'A':
            client.statut_client = 'A'
            client.save()
        password = request.data['password']
        if(check_password(password, client.password)):
            autorisation_prelevement = 'null'
            if client.autorisation_prelevement:
                autorisation_prelevement = client.autorisation_prelevement.url
            client_details = {
                'id': client.id,
                'societe': client.societe,
                'password': client.password,
                'email': client.email,
                'date_reglement': client.date_reglement,
                'periodicite': client.periodicite,
                'montant': client.montant,
                'mode_de_reglement': client.mode_de_reglement,
                'statut': client.statut,
                'iban': client.iban,
                'card_info': client.card_info,
                'token': client.token,
                'autorisation_prelevement': autorisation_prelevement
            }
            return Response({
                'client': client_details,
                'message': 'Authentification réussie'
            })
        else:
            return Response({
                'error': 'Mot de passe incorrect'
            })
    else:
        return Response({
            'error': 'Email incorrect'
        })


@api_view(['POST'])
def update_client_credentials(request, pk):
    email = request.data['email']
    password = request.data['password']
    societe = request.data['societe']
    client = Client.objects.get(id=pk)
    client.email = email
    client.password = make_password(password)
    client.societe = societe
    client.save()
    return Response({
        'client': {
            'email': client.email,
            'societe': client.societe,
            'password': password
        },
        'message': 'success'
    })



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def set_iban(request):
    """
        @params: None
        @return: String Message
        @desc: Update Iban and set Stripe Subscription for the client
    """
    pk = request.data['id']
    autorisation_prelevement = request.data['autorisation_prelevement']
    payment_method_id = request.data['payment_method']
    client = Client.objects.get(id=pk)
    if client.subscription_id:
        try:
            stripe.Subscription.delete(client.subscription_id)
        except Exception as e:
            pass
    payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
    client.autorisation_prelevement = autorisation_prelevement
    client.iban = f'{payment_method.sepa_debit.country}{payment_method.sepa_debit.bank_code}*******{payment_method.sepa_debit.last4}'
    montant = int(client.montant) * 100
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
                'plan': client.plan_id
            }
        ],
        expand=['latest_invoice.payment_intent'],
        trial_end=trial_end,
        billing_cycle_anchor=billing_cycle_anchor
    )
    client.date_reglement = datetime.fromtimestamp(billing_cycle_anchor)
    client.customer_id = customer.id
    client.subscription_id = subscription.id
    client.save()
    return Response({
        'message': 'Iban ajouté avec succès'
    })


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def set_card_info(request):
    """
        @params: None
        @return: String Message
        @desc: Update Iban and set Stripe Subscription for the client
    """
    pk = request.data['id']
    autorisation_prelevement = request.data['autorisation_prelevement']
    payment_method_id = request.data['payment_method']
    client = Client.objects.get(id=pk)
    if client.subscription_id:
        try:
            stripe.Subscription.delete(client.subscription_id)
        except Exception as e:
            pass
    payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
    client.card_info = f'{payment_method.card.brand} ******************{payment_method.card.last4}'
    client.autorisation_prelevement = autorisation_prelevement
    montant = int(client.montant) * 100
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
                'plan': client.plan_id
            }
        ],
        expand=['latest_invoice.payment_intent'],
        trial_end=trial_end,
        billing_cycle_anchor=billing_cycle_anchor
    )
    client.date_reglement = datetime.fromtimestamp(billing_cycle_anchor)
    client.customer_id = customer.id
    client.subscription_id = subscription.id
    client.save()
    return Response({
        'message': 'Carte Bancaire ajouté avec succès'
    })



@api_view(['POST'])
def update_price(request, token):
    client = Client.objects.get(token=token)
    new_price = request.data['price']
    client.montant = int(new_price) 
    client.save()
    montant = client.client.montant * 100
    stripe.Plan.modify(
        client.plan_id,
        amount=montant
    )  


@api_view(['GET'])
def get_client_payments(request, pk):
    invoices = stripe.Invoice.list()
    client = Client.objects.get(id=pk)
    client_payments = []
    for invoice in invoices.data:
        if invoice.customer == client.customer_id and invoice.status == 'paid':
            client_payments.append(invoice)
    return Response({
        'payments': client_payments
    })