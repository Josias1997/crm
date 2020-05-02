from django.db import models
import secrets
import uuid

# Create your models here.
PERIODICITES = [
    ('H', 'HEBDOMADAIRE'),
    ('M', 'MENSUEL'),
    ('T', 'TRIMESTRIEL'),
    ('S', 'SEMESTRIEL'),
    ('A', 'ANNUEL')
]

STATUTS_PAYEMENT = [
    ('R', 'REGLEMENT A JOUR'),
    ('N', 'NON A JOUR'),
]

STATUS_CLIENT = [
    ('A', 'ACTIF'),
    ('D', 'DESACTIVE')
]

MODES_DE_REGLEMENT = [
    ('P', 'PRELEVEMENT')
]

def client_directory_path(instance, filename):
    return f'api/files/{instance.societe}/{filename}'


class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    societe = models.CharField(max_length=255)
    email = models.EmailField()
    password = models.CharField(max_length=255, blank=True, null=True)
    date_reglement = models.DateTimeField(blank=True, null=True)
    periodicite = models.CharField(max_length=1, default='H', choices=PERIODICITES)
    montant = models.DecimalField(decimal_places=2, max_digits=9)
    mode_de_reglement = models.CharField(max_length=1, default='P', choices=MODES_DE_REGLEMENT)
    statut = models.CharField(max_length=1, default='N', choices=STATUTS_PAYEMENT)
    statut_client = models.CharField(max_length=1, default='D', choices=STATUS_CLIENT)
    iban = models.CharField(max_length=255, null=True, blank=True)
    card_info = models.CharField(max_length=255, null=True, blank=True)
    autorisation_prelevement = models.FileField(upload_to=client_directory_path, null=True, blank=True)
    customer_id = models.CharField(max_length=255, blank=True, null=True)
    plan_id = models.CharField(max_length=255, blank=True, null=True)
    product_id = models.CharField(max_length=255, blank=True, null=True)
    subscription_id = models.CharField(max_length=255, blank=True, null=True)
    token = models.CharField(max_length=255, default=secrets.token_urlsafe(32))

    def __str__(self):
        return self.societe
