# pedidos/serializers.py
from rest_framework import serializers
from .models import Pedido, DetallePedido

class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = ['plato', 'cantidad', 'precioUnitario', 'subtotal']
        # Protegemos estos campos para que el cliente no pueda alterarlos enviando un JSON falso.
        # El backend será quien los calcule consultando directamente a MySQL.
        read_only_fields = ['precioUnitario', 'subtotal']

    def validate_cantidad(self, value):
        """
        Validación de seguridad: Impide que un usuario malintencionado
        envíe cantidades negativas (ej. -5) para alterar el total del pedido.
        """
        if value <= 0:
            raise serializers.ValidationError("La cantidad de platos debe ser mayor a cero.")
        return value

    def validate(self, data):
        """
        Validación de negocio: Verifica el estado cruzado de otras tablas.
        """
        plato = data.get('plato')
        
        # Bloquea la compra si el plato fue desactivado por el restaurante.
        if plato and not plato.disponible:
            raise serializers.ValidationError(f"Lo sentimos, el plato '{plato.nombre}' ya no está disponible.")
            
        return data

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'fechaRegistro', 'tipoEntrega', 'estado', 'fechaHoraEntregaEstimada', 'total', 'cliente', 'ruta_entrega', 'detalles']
        # Protegemos el estado y el total para que no sean manipulables desde el Frontend.
        read_only_fields = ['estado', 'total', 'cliente']