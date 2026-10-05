from django.db import models
from django.db.models import CheckConstraint, Q  # Importaciones nuevas para las restricciones en MySQL
from usuarios.models import PerfilCliente

class Cuenta(models.Model):
    # Atributo que almacena el dinero disponible financiado por las empresas. 
    # Por defecto inicia en 0.
    saldoDisponible = models.IntegerField(default=0)
    
    # Fecha del último movimiento. 'auto_now=True' actualiza la fecha automáticamente cada vez que el registro se guarda o modifica.
    fechaUltimoAbono = models.DateField(auto_now=True)
    
    # Relación de composición (Uno a Uno) con el ClienteRegistrado.
    # on_delete=models.CASCADE asegura que si se elimina el cliente, su cuenta financiera también se destruya.
    cliente = models.OneToOneField(
        PerfilCliente, 
        on_delete=models.CASCADE, 
        related_name='cuenta_corporativa'
    )

    class Meta:
        # Aquí definimos las restricciones que se aplicarán directamente en el motor relacional (MySQL).
        constraints = [
            CheckConstraint(
                # Obliga a MySQL a rechazar cualquier intento de guardar un número menor a 0.
                # 'gte' significa "Greater Than or Equal" (Mayor o igual que).
                condition=Q(saldoDisponible__gte=0),
                name='saldo_no_negativo'
            )
        ]

    def descontar_saldo(self, monto):
        """
        Método encapsulado para procesar pagos. 
        Verifica lógicamente si hay saldo suficiente y lo descuenta.
        Retorna True si el cobro fue exitoso, o False si los fondos son insuficientes.
        """
        if self.saldoDisponible >= monto:
            self.saldoDisponible -= monto
            self.save()
            return True
        return False
        
    def abonar_saldo(self, monto):
        """
        Método para reintegrar o sumar dinero a la cuenta corporativa.
        Se utilizará para las recargas que hacen las empresas y para los 
        reembolsos parciales o totales cuando se cancela un pedido.
        """
        self.saldoDisponible += monto
        self.save()
        return True

    def __str__(self):
        # Define cómo se leerá este objeto en el panel de administración de Django.
        return f"Cuenta de: {self.cliente.username} - Saldo: ${self.saldoDisponible}"