from django.urls import path
from . import views

urlpatterns = [
    path('client/delete/<int:pk>', views.delete_client),
    path('client/update/<int:pk>', views.update_client),
    path('client/get/<int:pk>/', views.get_client),
    path('client/post/', views.add_client),
    path('client/update-iban/', views.update_iban),
    path('clients/', views.get_clients),
    path('webhooks/', views.webhooks_view)
]