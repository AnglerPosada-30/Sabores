# catalogo/urls.py
from django.urls import path
from .views import CatalogoListView, GestionarOfertaView

urlpatterns = [
    path('', CatalogoListView.as_view(), name='listar_catalogo'),
    path('mis-platos', GestionarOfertaView.as_view(), name='gestionar_oferta'),
]