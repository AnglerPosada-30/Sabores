# catalogo/urls.py
from django.urls import path
from .views import CatalogoListView

urlpatterns = [
    path('', CatalogoListView.as_view(), name='listar_catalogo'),
]