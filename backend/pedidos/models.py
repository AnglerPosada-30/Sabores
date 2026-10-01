from django.db import models
from usuarios.models import PerfilCliente, PerfilRepartidor
from catalogo.models import Plato

class RutaEntrega(models.Model):
    # Agrupa múltiples pedidos por zona o fecha para optimizar el modelo de despacho[cite: 1]
    fecha = models.DateField(auto_now_add=True)
    zona = models.CharField(max_length=100)
    
    # Asignación al repartidor (0..* a 1)[cite: 1]
    repartidor = models.ForeignKey(
        PerfilRepartidor, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='rutas_asignadas'
    )

    def __str__(self):
        return f"Ruta {self.zona} - {self.fecha}"

class Pedido(models.Model):
    ESTADOS = (
        ('PENDIENTE', 'Pendiente'),
        ('PREPARACION', 'Preparación'),
        ('DESPACHO', 'Despacho'),
        ('ENTREGADO', 'Entregado'),
    )
    TIPO_ENTREGA = (
        ('DOMICILIO', 'Domicilio'),
        ('LOCAL', 'Local'),
    )
    
    # Atributos del Diagrama de Clases[cite: 1]
    fechaRegistro = models.DateTimeField(auto_now_add=True)
    tipoEntrega = models.CharField(max_length=15, choices=TIPO_ENTREGA, default='LOCAL')
    estado = models.CharField(max_length=15, choices=ESTADOS, default='PENDIENTE')
    fechaHoraEntregaEstimada = models.DateTimeField(null=True, blank=True)
    total = models.IntegerField(default=0)
    
    # Relaciones
    cliente = models.ForeignKey(PerfilCliente, on_delete=models.CASCADE, related_name='pedidos_realizados')
    ruta_entrega = models.ForeignKey(RutaEntrega, on_delete=models.SET_NULL, null=True, blank=True, related_name='pedidos_ruta')

    def __str__(self):
        return f"Pedido #{self.id} - {self.estado}"

class DetallePedido(models.Model):
    # Desglosa los productos solicitados[cite: 1]
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    plato = models.ForeignKey(Plato, on_delete=models.RESTRICT) # RESTRICT evita borrar un plato si hay pedidos asociados
    
    cantidad = models.IntegerField(default=1)
    precioUnitario = models.IntegerField()
    subtotal = models.IntegerField()

    def save(self, *args, **kwargs):
        # Sobrescribimos el método save para calcular el subtotal automáticamente
        self.subtotal = self.cantidad * self.precioUnitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cantidad}x {self.plato.nombre} (Pedido #{self.pedido.id})"