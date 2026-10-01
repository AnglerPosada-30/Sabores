# pedidos/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Pedido, DetallePedido
from catalogo.models import Plato
from finanzas.services import PagoSaldoCorporativo, PagoPasarelaTarjeta

class ProcesarPedidoView(APIView):
    # Patrón Facade: Centraliza la lógica compleja[cite: 1]
    
    @transaction.atomic  # Garantía de Procedimiento Transaccional (ACID)[cite: 1]
    def post(self, request):
        usuario = request.user
        items = request.data.get('items', [])
        metodo_pago = request.data.get('metodo_pago', 'CORPORATIVO')
        
        if not items:
            return Response({"error": "El pedido está vacío"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Calcular el total y validar existencia de platos
            total_pedido = 0
            platos_procesados = []
            for item in items:
                plato = Plato.objects.get(id=item['plato_id'])
                subtotal = plato.precio * item['cantidad']
                total_pedido += subtotal
                platos_procesados.append({'plato': plato, 'cantidad': item['cantidad'], 'precio': plato.precio})

            # 2. Patrón Strategy: Seleccionar y ejecutar el método de pago[cite: 1]
            if metodo_pago == 'CORPORATIVO':
                estrategia = PagoSaldoCorporativo()
            else:
                estrategia = PagoPasarelaTarjeta()

            # Invocación encapsulada al módulo financiero[cite: 1]
            pago_exitoso = estrategia.procesar_cobro(usuario, total_pedido)

            # 3. Bifurcación del flujo según resultado (Diagrama de Secuencia)[cite: 1]
            if not pago_exitoso:
                # Interrumpe la transacción y retorna el código de estado exacto requerido[cite: 1]
                return Response({"error": "Fondos Insuficientes"}, status=status.HTTP_402_PAYMENT_REQUIRED)

            # 4. Inserción de datos (INSERT INTO) si el pago fue exitoso[cite: 1]
            pedido = Pedido.objects.create(
                cliente=usuario.perfil_cliente,
                total=total_pedido,
                estado='PREPARACION' # Avanza de PENDIENTE a PREPARACION automáticamente
            )

            for p in platos_procesados:
                DetallePedido.objects.create(
                    pedido=pedido,
                    plato=p['plato'],
                    cantidad=p['cantidad'],
                    precioUnitario=p['precio']
                )

            # El commit final a MySQL se realiza automáticamente al terminar el bloque @transaction.atomic sin errores[cite: 1]
            return Response({"mensaje": "Pedido Creado y Pagado Exitosamente", "pedido_id": pedido.id}, status=status.HTTP_201_CREATED)

        except Plato.DoesNotExist:
            return Response({"error": "Un plato seleccionado no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Cualquier error inesperado cancela todas las inserciones y cobros en la base de datos
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)