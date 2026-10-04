from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import Usuario, PerfilCliente, EmpresaConvenio
from .serializers import UsuarioSerializer

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic  # Asegura que si algo falla, no se guarde nada a medias
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # 1. Extraer los datos adicionales del frontend
                nombre = request.data.get('nombre', '')
                direccion = request.data.get('direccion', '')
                comuna = request.data.get('comuna', '')
                ciudad = request.data.get('ciudad', '')
                empresa_nombre = request.data.get('empresa', '').strip()
                password = request.data.get('password')

                # Unificar la dirección para el PerfilCliente
                direccion_completa = f"{direccion}, {comuna}, {ciudad}"

                # Lógica de negocio: Asignar rol según si ingresó empresa o no
                rol_asignado = 'CLIENTE_CORP' if empresa_nombre else 'CLIENTE'

                # 2. Crear el Usuario base (encriptando contraseña internamente)
                usuario = Usuario.objects.create_user(
                    username=serializer.validated_data.get('rut'),  # Usamos RUT como identificador de login
                    email=serializer.validated_data.get('email'),
                    rut=serializer.validated_data.get('rut'),
                    telefono=serializer.validated_data.get('telefono'),
                    password=password,
                    first_name=nombre,
                    rol=rol_asignado
                )

                # 3. Gestionar la Empresa y el Perfil
                empresa_obj = None
                if empresa_nombre:
                    # Busca la empresa, si no existe la crea
                    empresa_obj, created = EmpresaConvenio.objects.get_or_create(
                        razon_social=empresa_nombre,
                        defaults={'direccion': 'Por definir'}
                    )

                PerfilCliente.objects.create(
                    usuario=usuario,
                    direccion_frecuente=direccion_completa,
                    empresa_convenio=empresa_obj
                )

                return Response(
                    {"mensaje": f"Usuario {nombre} registrado exitosamente como {rol_asignado}."}, 
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                return Response(
                    {"error": "Hubo un problema al crear la cuenta. Verifica que el correo o RUT no estén duplicados."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Si la validación del RUT o email falla, devuelve el error del serializador
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)