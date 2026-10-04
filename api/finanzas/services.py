# finanzas/services.py
from finanzas.models import Cuenta

# Interfaz base para el Patrón Strategy
class IEstrategiaPago:
    def procesar_cobro(self, usuario, monto):
        raise NotImplementedError("Debe implementar este método")

# Estrategia concreta para Cliente Corporativo
class PagoSaldoCorporativo(IEstrategiaPago):
    def procesar_cobro(self, usuario, monto):
        try:
            # Buscamos la cuenta corporativa asociada al perfil del usuario
            cuenta = Cuenta.objects.get(cliente__usuario=usuario)
            # El método descontar_saldo ya valida internamente si hay fondos suficientes
            return cuenta.descontar_saldo(monto)
        except Cuenta.DoesNotExist:
            return False

# Estrategia concreta para Cliente Tradicional (Pasarela externa)
class PagoPasarelaTarjeta(IEstrategiaPago):
    def procesar_cobro(self, usuario, monto):
        # Aquí iría la integración con Transbank/Stripe.
        # Por ahora simularemos que siempre es exitoso.
        return True