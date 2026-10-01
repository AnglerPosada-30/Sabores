from django.db import models
from usuarios.models import PerfilCliente

class Cuenta(models.Model):
    # Atributos definidos en el Diagrama de Clases UML[cite: 1]
    saldoDisponible = models.IntegerField(default=0)
    fechaUltimoAbono = models.DateField(auto_now=True)
    
    # Relación de composición con el ClienteRegistrado (PerfilCliente)[cite: 1]
    cliente = models.OneToOneField(
        PerfilCliente, 
        on_delete=models.CASCADE, 
        related_name='cuenta_corporativa'
    )

    def descontar_saldo(self, monto):
        if self.saldoDisponible >= monto:
            self.saldoDisponible -= monto
            self.save()
            return True
        return False

    def __str__(self):
        return f"Cuenta de: {self.cliente.usuario.username} - Saldo: ${self.saldoDisponible}"