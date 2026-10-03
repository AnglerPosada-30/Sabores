# catalogo/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
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


class GestionarOfertaView(generics.ListCreateAPIView):
    """
    Permite a un proveedor ver sus propios platos y agregar nuevos.
    """
    serializer_class = PlatoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra la base de datos para que el proveedor solo vea sus platos
        if self.request.user.rol == 'PROVEEDOR':
            return Plato.objects.filter(proveedor__usuario=self.request.user)
        raise PermissionDenied("No tienes permisos para gestionar ofertas.")

    def perform_create(self, serializer):
        # Al crear un plato, se asigna automáticamente al proveedor logueado
        if self.request.user.rol == 'PROVEEDOR':
            serializer.save(
                proveedor=self.request.user.perfil_proveedor, 
                esPropio=False
            )
        else:
            raise PermissionDenied("Solo los proveedores registrados pueden añadir platos.")