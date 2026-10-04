from django.db import models
from django.db.models import CheckConstraint, Q
from usuarios.models import Proveedor

class Plato(models.Model):
    # Definimos las categorías exactas que espera el frontend
    CATEGORIAS = (
        ('platos', 'Platos y Entradas'),
        ('bebestibles', 'Bebestibles'),
        ('postres', 'Postres Variados'),
        ('extras', 'Extras y Salsas'),
    )

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.IntegerField()
    
    # Nuevos campos para sincronizar con React
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='platos')
    icono = models.CharField(max_length=10, default='', blank=True, help_text="Emoji representativo")
    
    esPropio = models.BooleanField(default=True)
    disponible = models.BooleanField(default=True)
    
    proveedor = models.ForeignKey(
        Proveedor, 
        on_delete=models.CASCADE, 
        related_name='platos_suministrados',
        null=True, 
        blank=True
    )

    class Meta:
        constraints = [
            CheckConstraint(
                condition=Q(precio__gte=0),
                name='precio_plato_no_negativo'
            )
        ]

    def __str__(self):
        origen = "Propio" if self.esPropio else f"Proveedor: {self.proveedor.nombre_comercial if self.proveedor else 'Desconocido'}"
        return f"[{self.get_categoria_display()}] {self.icono} {self.nombre} - {origen}"