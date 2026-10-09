from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import transaction
from .models import Usuario, PerfilCliente, EmpresaConvenio
from .serializers import UsuarioSerializer

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    # Utilizo el decorador @transaction.atomic para garantizar el principio ACID.
    # Si falla la creación del usuario o del perfil, se hace un rollback completo
    # y la base de datos no queda con información inconsistente o a medias.
    @transaction.atomic 
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # 1. Extracción de la data estructurada desde el payload del frontend
                nombre = request.data.get('nombre', '')
                direccion = request.data.get('direccion', '')
                comuna = request.data.get('comuna', '')
                ciudad = request.data.get('ciudad', '')
                empresa_nombre = request.data.get('empresa', '').strip()
                password = request.data.get('password')

                direccion_completa = f"{direccion}, {comuna}, {ciudad}"

                # Lógica de asignación dinámica de rol dependiendo de la entrada
                rol_asignado = 'CLIENTE_CORP' if empresa_nombre else 'CLIENTE'

                # 2. Creación segura del Usuario delegando el hashing de la password a Django
                usuario = Usuario.objects.create_user(
                    username=serializer.validated_data.get('rut'),  
                    email=serializer.validated_data.get('email'),
                    rut=serializer.validated_data.get('rut'),
                    telefono=serializer.validated_data.get('telefono'),
                    password=password,
                    first_name=nombre,
                    rol=rol_asignado
                )

                # 3. Gestión relacional de Empresas y Perfiles
                empresa_obj = None
                if empresa_nombre:
                    # Utilizo get_or_create para no duplicar empresas en la base de datos
                    empresa_obj, created = EmpresaConvenio.objects.get_or_create(
                        razon_social=empresa_nombre,
                        defaults={'direccion': 'Por definir'}
                    )

                PerfilCliente.objects.create(
                    usuario=usuario,
                    direccion_frecuente=direccion_completa,
                    empresa_convenio=empresa_obj
                    # Nota: El saldo inicia en 0 por defecto según mi modelo
                )

                return Response(
                    {"mensaje": f"Usuario {nombre} registrado exitosamente como {rol_asignado}."}, 
                    status=status.HTTP_201_CREATED
                )

            except Exception as e:
                # Captura de excepciones de integridad de MySQL (ej. RUT duplicado)
                return Response(
                    {"error": "Hubo un problema al crear la cuenta. Verifica que el correo o RUT no estén duplicados."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Retorno de errores de validación del serializador (ej. RUT inválido)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecargarSaldoCorporativoView(APIView):
    """
    Endpoint administrativo para la gestión de la billetera de convenios corporativos.
    """
    def post(self, request):
        # 1. Capa de Seguridad: Verifico que el solicitante tenga privilegios de Administrador.
        if not request.user.is_staff and not request.user.is_superuser and request.user.rol != 'ADMIN':
            return Response({"error": "Acceso denegado. Operación exclusiva para administradores."}, status=status.HTTP_403_FORBIDDEN)
        
        rut_cliente = request.data.get('rut')
        monto_a_recargar = request.data.get('monto', 0)
        
        try:
            # 2. Sanitización y validación de los datos de entrada
            monto_int = int(monto_a_recargar)
            if monto_int <= 0:
                return Response({"error": "El monto de recarga debe ser mayor a 0"}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Búsqueda exacta del cliente usando su RUT y asegurando que sea Corporativo
            cliente = Usuario.objects.get(rut=rut_cliente, rol='CLIENTE_CORP')
            perfil = cliente.perfil_cliente
            
            # 4. Actualización del estado financiero (Update)
            perfil.saldo += monto_int
            perfil.save()
            
            return Response({
                "mensaje": f"Recarga exitosa. El nuevo saldo de {cliente.first_name} es ${perfil.saldo}",
                "nuevo_saldo": perfil.saldo
            }, status=status.HTTP_200_OK)
            
        except Usuario.DoesNotExist:
            return Response({"error": "No se encontró ningún Cliente Corporativo con ese RUT en el sistema."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"error": "El formato del monto no es válido. Debe ser numérico."}, status=status.HTTP_400_BAD_REQUEST)
        

class CambiarRolUsuarioView(APIView):
    """
    Endpoint administrativo para actualizar el RBAC de cualquier usuario.
    """
    def patch(self, request):
        # 1. Seguridad estricta: Solo administradores
        if not (request.user.is_staff or request.user.is_superuser or getattr(request.user, 'rol', '') == 'ADMIN'):
            return Response({"error": "No tienes permisos de administrador."}, status=status.HTTP_403_FORBIDDEN)

        rut_usuario = request.data.get('rut')
        nuevo_rol = request.data.get('rol')

        # 2. Validamos que el rol esté dentro de las opciones permitidas
        roles_validos = ['CLIENTE', 'CLIENTE_CORP', 'REPARTIDOR', 'ADMIN']
        if nuevo_rol not in roles_validos:
            return Response({"error": f"Rol no válido. Opciones permitidas: {roles_validos}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 3. Buscamos al usuario por su RUT
            usuario_objetivo = Usuario.objects.get(rut=rut_usuario)
            
            # 4. Actualizamos y guardamos
            usuario_objetivo.rol = nuevo_rol
            usuario_objetivo.save()

            # CORRECCIÓN AQUÍ: La variable correcta es usuario_objetivo
            nombre_mostrar = usuario_objetivo.first_name or usuario_objetivo.username
            return Response({
                "mensaje": f"El rol de {nombre_mostrar} ha sido actualizado a {nuevo_rol} exitosamente."
            }, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "No se encontró ningún usuario con ese RUT en el sistema."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Si ocurre cualquier otro error, lo mostramos en lugar de crashear con un 500 en silencio
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)