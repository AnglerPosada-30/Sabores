# pedidos/urls.py
from django.urls import path
from .views import ActualizarEstadoPedidoView, ProcesarPedidoView, PedidosEnDespachoView

urlpatterns = [
    path('', ProcesarPedidoView.as_view(), name='procesar_pedido'),

    #Nuevo endpoint para el repartidor
    path('despacho/', PedidosEnDespachoView.as_view(), name='pedidos_despacho'),
    path('<int:pedido_id>/estado/', ActualizarEstadoPedidoView.as_view(), name='actualizar_estado'),

]