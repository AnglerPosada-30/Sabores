# pedidos/apps.py
from django.apps import AppConfig

class PedidosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pedidos'

    def ready(self):
        # Al arrancar la app, importamos las señales para activar el Patrón Observer
        import pedidos.signals