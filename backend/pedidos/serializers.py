from rest_framework import serializers
from .models import Pedido, DetallePedido

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = ['plato', 'cantidad', 'precioUnitario', 'subtotal']
        read_only_fields = ['subtotal'] # Se calcula automáticamente en el modelo

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'fechaRegistro', 'tipoEntrega', 'estado', 'fechaHoraEntregaEstimada', 'total', 'cliente', 'ruta_entrega', 'detalles']
        read_only_fields = ['estado', 'total']