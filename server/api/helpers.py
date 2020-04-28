from django.core.mail import send_mail
from django.conf import settings

def generate_client_url(client_societe, client_id, client_token):
    return f'{settings.CLIENT_URL}/activate-account/{client_societe}/{client_id}/{client_token}'


def send_url_to_client(url, client_email):
    send_mail("Activation compte", f"Procédez à l'activation de votre compte en cliquant sur ce lien {url}", 
    settings.EMAIL_HOST_USER, [client_email], fail_silently=False)