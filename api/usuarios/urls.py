from django.urls import path
from .views import RegistroUsuarioView, RecargarSaldoCorporativoView

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('abonar-saldo/', RecargarSaldoCorporativoView.as_view(), name='abonar_saldo_corporativo'),
]