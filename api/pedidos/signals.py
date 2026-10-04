# pedidos/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Pedido

# Este decorador convierte a la función en un "Observador" que escucha a la clase Pedido[cite: 1]
@receiver(post_save, sender=Pedido)
def notificar_cambio_estado_pedido(sender, instance, created, **kwargs):
    if created:
        # Lógica para cuando el pedido se inserta en MySQL por primera vez
        print(f"[Notificador] NUEVO PEDIDO #{instance.id} registrado.")
        print(f"[Pantalla Cocina] Mostrar pedido #{instance.id} en monitor de cocina.")
    else:
        # Lógica para cuando el pedido cambia de estado
        if instance.estado == 'PREPARACION':
            print(f"[Notificador] El pedido #{instance.id} se está preparando.")
        
        elif instance.estado == 'DESPACHO':
            print(f"[Gestor Rutas] Alerta: Asignar pedido #{instance.id} a la ruta logística más cercana.")
            print(f"[Notificador Cliente] Enviar SMS al cliente: Tu pedido va en camino.")
            
        elif instance.estado == 'ENTREGADO':
            print(f"[Logística] Pedido #{instance.id} entregado con éxito. Cerrando ciclo.")