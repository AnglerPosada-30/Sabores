# catalogo/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Plato
from .serializers import PlatoSerializer

class CatalogoListView(generics.ListAPIView):
    """
    Retorna la lista de todos los platos disponibles, fusionando 
    la oferta propia y la de proveedores externos.
    """
    queryset = Plato.objects.filter(disponible=True)
    serializer_class = PlatoSerializer
    # Usamos AllowAny para que el cliente pueda ver el catálogo sin estar logueado aún
    permission_classes = [AllowAny]