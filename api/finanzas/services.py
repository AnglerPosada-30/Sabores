from usuarios.models import PerfilCliente

# En este archivo implemento el Patrón de Diseño Strategy.
# Esto me permite encapsular los distintos métodos de pago y hacer que el 
# sistema sea escalable si el día de mañana quiero agregar Webpay, PayPal, etc.

class PagoSaldoCorporativo:
    """
    Estrategia de cobro para clientes con convenio (B2B).
    Aquí me conecto directamente a la billetera del usuario en la base de datos.
    """
    def procesar_cobro(self, usuario, total_pedido):
        try:
            # 1. Recupero el perfil del cliente asociado al usuario actual
            perfil = usuario.perfil_cliente
            
            # 2. Valido como regla de negocio que los fondos sean suficientes
            if perfil.saldo >= total_pedido:
                # 3. Descuento el dinero y guardo la transacción en MySQL
                perfil.saldo -= total_pedido
                perfil.save()
                return True # Pago aprobado
            
            # Si no le alcanza el dinero, rechazo la operación
            return False
        except Exception as e:
            # Si el usuario no tiene perfil o hay un error de DB, se rechaza por seguridad
            return False

class PagoPasarelaTarjeta:
    """
    Estrategia de cobro simulada para clientes regulares.
    En un entorno de producción, aquí integraría el SDK de Transbank o MercadoPago.
    """
    def procesar_cobro(self, usuario, total_pedido):
        # Por el alcance actual del proyecto, simulamos que la pasarela aprueba el pago.
        return True