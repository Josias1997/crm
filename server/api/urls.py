from django.urls import path
from . import views

urlpatterns = [
    path('client/delete/<str:pk>', views.delete_client),
    path('client/update/<str:pk>', views.update_client),
    path('client/get/<str:pk>/', views.get_client),
    path('client/post/', views.add_client),
    path('client/update-iban/', views.update_iban),
    path('client/update_price/<str:token>', views.update_price),
    path('clients/', views.get_clients),
    path('webhooks/', views.webhooks_view)
]