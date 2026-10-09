from django.urls import path
from .views import CambiarRolUsuarioView, RegistroUsuarioView, RecargarSaldoCorporativoView

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('abonar-saldo/', RecargarSaldoCorporativoView.as_view(), name='abonar_saldo_corporativo'),
    path('cambiar-rol/', CambiarRolUsuarioView.as_view(), name='cambiar_rol_usuario'),
]
