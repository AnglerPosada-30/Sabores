from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import re
from rest_framework import serializers
from .models import Usuario, PerfilCliente

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rut', 'telefono', 'rol']

    # En esta función implemento la validación matemática del RUT chileno.
    # Me aseguro de limpiar puntos y guiones, y luego calculo el Dígito Verificador 
    # usando el algoritmo de módulo 11 para evitar registros con datos basura.
    def validate_rut(self, value):
        if not value: return value
        rut_limpio = value.replace(".", "").replace("-", "").upper()
        if not re.match(r'^\d{7,8}[0-9K]$', rut_limpio):
            raise serializers.ValidationError("Formato inválido.")
        
        cuerpo = rut_limpio[:-1]
        dv_ingresado = rut_limpio[-1]
        suma = 0
        multiplo = 2
        
        for c in reversed(cuerpo):
            suma += int(c) * multiplo
            multiplo = multiplo + 1 if multiplo < 7 else 2
            
        dv_esperado = 11 - (suma % 11)
        dv_calculado = '0' if dv_esperado == 11 else 'K' if dv_esperado == 10 else str(dv_esperado)
        
        if dv_ingresado != dv_calculado:
            raise serializers.ValidationError("Dígito verificador incorrecto.")
            
        return rut_limpio

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Sobrescribo el comportamiento por defecto de SimpleJWT para inyectar 
    # variables personalizadas (payload) dentro del token de sesión.
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # 1. Asignación del Control de Acceso Basado en Roles (RBAC)
        if self.user.is_superuser or self.user.is_staff:
            data['rol'] = 'ADMIN'
        elif hasattr(self.user, 'rol') and self.user.rol:
            data['rol'] = str(self.user.rol).strip().upper()
        else:
            data['rol'] = 'CLIENTE'

        # 2. Lógica de Negocio: Billetera y Cliente Corporativo
        # Defino los valores por defecto para clientes regulares
        data['tipo_cliente'] = 'normal'
        data['saldo'] = 0

        # Si detecto que es un cliente de empresa, le informo al frontend y 
        # voy a buscar su saldo real directamente a la base de datos.
        if data['rol'] == 'CLIENTE_CORP':
            data['tipo_cliente'] = 'empresa'
            
            # Verifico que tenga un perfil creado para evitar errores de referencia
            if hasattr(self.user, 'perfil_cliente'):
                data['saldo'] = self.user.perfil_cliente.saldo 
            
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer