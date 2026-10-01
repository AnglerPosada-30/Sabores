# finanzas/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Cuenta

class EstadoCuentaView(APIView):
    # Exige que el usuario envíe un token JWT válido
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Busca la cuenta asociada al perfil del usuario autenticado
            cuenta = Cuenta.objects.get(cliente__usuario=request.user)
            return Response({
                "cliente": request.user.get_full_name() or request.user.username,
                "saldo_disponible": cuenta.saldoDisponible,
                "fecha_ultimo_abono": cuenta.fechaUltimoAbono
            }, status=status.HTTP_200_OK)
        except Cuenta.DoesNotExist:
            return Response(
                {"error": "No tienes una cuenta corporativa asociada."}, 
                status=status.HTTP_404_NOT_FOUND
            )