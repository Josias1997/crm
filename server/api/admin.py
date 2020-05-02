from django.contrib import admin
from .models import Client, Notification

# Register your models here.
admin.site.register(Client)
admin.site.register(Notification)
