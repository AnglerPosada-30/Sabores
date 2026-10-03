from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Modelo Central de Identidad (Reemplaza al User por defecto de Django)
class Usuario(AbstractUser):
    # Tipos de roles basados en tu patrón Factory y Actores del sistema
    TIPO_USUARIO = (
        ('ADMIN', 'Administrador'),
        ('CLIENTE', 'Cliente Regular'),
        ('CLIENTE_CORP', 'Cliente Corporativo'),
        ('REPARTIDOR', 'Repartidor'),
        ('PROVEEDOR', 'Proveedor'),
    )
    rol = models.CharField(max_length=15, choices=TIPO_USUARIO, default='CLIENTE')
    
    # Atributos compartidos por varios actores en tu Diagrama de Clases
    rut = models.CharField(max_length=12, unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"


# 2. Entidad EmpresaConvenio
class EmpresaConvenio(models.Model):
    razon_social = models.CharField(max_length=150)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return self.razon_social


# 3. Perfil para Cliente y ClienteRegistrado (Corporativo)
class PerfilCliente(models.Model):
    # Relación 1 a 1 con el modelo Usuario central
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_cliente')
    direccion_frecuente = models.CharField(max_length=200, null=True, blank=True)
    
    # Si este campo es nulo, es un Cliente Regular. Si tiene una empresa, es ClienteRegistrado (Corporativo)
    empresa_convenio = models.ForeignKey(EmpresaConvenio, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Perfil Cliente: {self.usuario.username}"


# 4. Perfil para Repartidor
class PerfilRepartidor(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_repartidor')
    vehiculo = models.CharField(max_length=50)

    def __str__(self):
        return f"Repartidor: {self.usuario.first_name} {self.usuario.last_name}"


# 5. Entidad Proveedor (Módulo de Catálogo Híbrido)
class Proveedor(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_proveedor')
    nombre_comercial = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    contacto = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_comercial