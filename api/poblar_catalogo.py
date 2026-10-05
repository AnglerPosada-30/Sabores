import os
import django

# Configurar el entorno para que Python reconozca tu proyecto Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalogo.models import Plato

def poblar_bd():
    platos_demo = [
        # Platos
        {'nombre': 'Cazuela de Vacuno Tradicional', 'desc': 'Preparación casera con vacuno fresco, zapallo, choclo y papa.', 'precio': 6500, 'cat': 'platos', 'icono': '🍲'},
        {'nombre': 'Pastel de Choclo en Greda', 'desc': 'Tradicional receta horneada con pino de carne, pollo y albahaca.', 'precio': 7000, 'cat': 'platos', 'icono': '🥧'},
        {'nombre': 'Lomo a lo Pobre Ejecutivo', 'desc': 'Bife tierno con papas fritas caseras, cebolla y dos huevos fritos.', 'precio': 8500, 'cat': 'platos', 'icono': '🥩'},
        
        # Bebestibles
        {'nombre': 'Jugo Natural del Día (500cc)', 'desc': 'Frambuesa, lúcuma o piña.', 'precio': 2500, 'cat': 'bebestibles', 'icono': '🧃'},
        {'nombre': 'Bebida en Lata 350ml', 'desc': 'Coca-Cola, Sprite o Fanta.', 'precio': 1500, 'cat': 'bebestibles', 'icono': '🥤'},
        
        # Postres
        {'nombre': 'Leche Asada Casera', 'desc': 'Receta tradicional con caramelo artesanal.', 'precio': 2200, 'cat': 'postres', 'icono': '🍮'},
        {'nombre': 'Panqueque con Manjar (2 unid.)', 'desc': 'Panqueques caseros rellenos de manjar.', 'precio': 2600, 'cat': 'postres', 'icono': '🥞'},
        
        # Extras
        {'nombre': 'Porción de Papas Fritas', 'desc': 'Papas cortadas a mano y crujientes.', 'precio': 3000, 'cat': 'extras', 'icono': '🍟'},
        {'nombre': 'Sopaipillas con Pebre (3 unid.)', 'desc': 'Sopaipillas pasadas o al plato con pebre fresco.', 'precio': 1500, 'cat': 'extras', 'icono': '🫓'},
    ]

    print("Iniciando carga rápida de platos...")
    for p in platos_demo:
        # get_or_create inserta el plato solo si no existe ya uno con ese nombre
        Plato.objects.get_or_create(
            nombre=p['nombre'],
            defaults={
                'descripcion': p['desc'],
                'precio': p['precio'],
                'categoria': p['cat'],
                'icono': p['icono'],
                'esPropio': True
            }
        )
    print("¡Catálogo poblado con éxito en MySQL!")

if __name__ == '__main__':
    poblar_bd()