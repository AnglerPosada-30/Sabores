from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import re
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rut', 'telefono', 'rol']

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
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # 1. Si es superusuario de Django, tiene pase VIP absoluto
        if self.user.is_superuser or self.user.is_staff:
            data['rol'] = 'ADMIN'
        # 2. Si no, leemos la columna 'rol' de MySQL (quitando espacios accidentales)
        elif hasattr(self.user, 'rol') and self.user.rol:
            data['rol'] = str(self.user.rol).strip().upper()
        # 3. Si no tiene rol, es cliente
        else:
            data['rol'] = 'CLIENTE'

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer