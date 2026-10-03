import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('django')

def custom_exception_handler(exc, context):
    # Invocar el handler predeterminado de DRF para errores 400, 401, 403, 404
    response = exception_handler(exc, context)

    # Si ocurre una excepción no controlada (error 500 interno)
    if response is None:
        vista = context.get('view')
        logger.error(f"Error no controlado en {vista}: {str(exc)}", exc_info=True)
        
        return Response(
            {
                "error": "Error interno del servidor",
                "detalle": "Ocurrió un problema al procesar la solicitud. El evento ha sido registrado."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response