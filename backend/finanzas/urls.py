# finanzas/urls.py
from django.urls import path
from .views import EstadoCuentaView

urlpatterns = [
    path('mi-saldo/', EstadoCuentaView.as_view(), name='estado_cuenta'),
]