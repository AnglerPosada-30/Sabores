from django.contrib import admin
from .models import Usuario, EmpresaConvenio, PerfilCliente, PerfilRepartidor, Proveedor

#Registramos en el Panel de Administración de Django los modelos definidos en models.py para que puedan ser gestionados desde el admin.
admin.site.register(Usuario)
admin.site.register(EmpresaConvenio)
admin.site.register(PerfilCliente)
admin.site.register(PerfilRepartidor)
admin.site.register(Proveedor)
