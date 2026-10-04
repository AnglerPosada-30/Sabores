# catalogo/models.py
from django.db import models
from django.db.models import CheckConstraint, Q
from usuarios.models import Proveedor

class Plato(models.Model):
    # Información básica del producto
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    
    # Precio de venta del producto.
    precio = models.IntegerField()
    
    # Indicador clave para el modelo B2B: True si es de "El Comilón", False si es de terceros.
    esPropio = models.BooleanField(default=True)
    
    # Indicador de stock. Evita eliminar registros para no romper el historial de pedidos pasados.
    disponible = models.BooleanField(default=True)
    
    # Vincula el plato a un restaurante externo. Si esPropio=True, este campo queda vacío (null).
    proveedor = models.ForeignKey(
        Proveedor, 
        on_delete=models.CASCADE, 
        related_name='platos_suministrados',
        null=True, 
        blank=True
    )

    class Meta:
        # Restricción a nivel de motor MySQL: Impide insertar precios negativos,
        # protegiendo el sistema de pérdidas financieras por errores de digitación.
        constraints = [
            CheckConstraint(
                condition=Q(precio__gte=0),
                name='precio_plato_no_negativo'
            )
        ]

    def __str__(self):
        origen = "Propio" if self.esPropio else f"Proveedor: {self.proveedor.nombre_comercial if self.proveedor else 'Desconocido'}"
        return f"{self.nombre} - {origen}"