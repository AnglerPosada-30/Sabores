from django.db import models
from usuarios.models import Proveedor

class Plato(models.Model):
    # Atributos definidos en el Diagrama de Clases UML
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.IntegerField()
    esPropio = models.BooleanField(default=True)
    disponible = models.BooleanField(default=True)
    
    # Relación para saber qué proveedor suministra este plato (0..* a 1)[cite: 1]
    proveedor = models.ForeignKey(
        Proveedor, 
        on_delete=models.CASCADE, 
        related_name='platos_suministrados',
        null=True, 
        blank=True
    )

    def __str__(self):
        origen = "Propio" if self.esPropio else f"Proveedor: {self.proveedor.nombre_comercial}"
        return f"{self.nombre} - {origen}"