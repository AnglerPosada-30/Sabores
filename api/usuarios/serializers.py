# usuarios/serializers.py
import re
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rut', 'telefono', 'rol']

    def validate_rut(self, value):
        """
        Validación estricta del RUT chileno usando el algoritmo Módulo 11.
        """
        if not value:
            return value

        # 1. Limpiar el string: quitar puntos, guiones y pasar a mayúscula (por la 'K')
        rut_limpio = value.replace(".", "").replace("-", "").upper()

        # 2. Validar con Expresión Regular que solo tenga números y termine en número o K
        if not re.match(r'^\d{7,8}[0-9K]$', rut_limpio):
            raise serializers.ValidationError("Formato de RUT inválido. Solo debe contener números y la letra K.")

        # 3. Separar el cuerpo del dígito verificador (dv)
        cuerpo = rut_limpio[:-1]
        dv_ingresado = rut_limpio[-1]

        # 4. Algoritmo Módulo 11
        suma = 0
        multiplo = 2
        
        # Recorrer el cuerpo del RUT de derecha a izquierda
        for c in reversed(cuerpo):
            suma += int(c) * multiplo
            multiplo = multiplo + 1 if multiplo < 7 else 2

        # Calcular el dígito verificador esperado
        dv_esperado = 11 - (suma % 11)
        
        if dv_esperado == 11:
            dv_calculado = '0'
        elif dv_esperado == 10:
            dv_calculado = 'K'
        else:
            dv_calculado = str(dv_esperado)

        # 5. Comparar el DV ingresado por el usuario con el calculado matemáticamente
        if dv_ingresado != dv_calculado:
            raise serializers.ValidationError("El RUT ingresado no es válido (Dígito verificador incorrecto).")
            
        return rut_limpio # Retorna el RUT limpio para guardarlo estandarizado en la BD