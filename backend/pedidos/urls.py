# pedidos/urls.py
from django.urls import path
from .views import ProcesarPedidoView

urlpatterns = [
    path('', ProcesarPedidoView.as_view(), name='procesar_pedido'),
]