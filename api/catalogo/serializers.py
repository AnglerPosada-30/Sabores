from rest_framework import serializers
from .models import Plato

class PlatoSerializer(serializers.ModelSerializer):
    nombre_proveedor = serializers.CharField(source='proveedor.nombre_comercial', read_only=True)

    class Meta:
        model = Plato
        fields = ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'icono', 'esPropio', 'disponible', 'proveedor', 'nombre_proveedor']