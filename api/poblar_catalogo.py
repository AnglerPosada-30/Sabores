import os
import django

# 1. Configurar el entorno de Django antes de importar los modelos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalogo.models import Plato

def poblar_bd():
    # Lista de diccionarios con los platos que teníamos en React
    platos_demo = [
        # Categoría: Platos
        {'nombre': 'Cazuela de Vacuno Tradicional', 'descripcion': 'Preparación casera con vacuno fresco, zapallo, choclo y papa.', 'precio': 6500, 'categoria': 'platos', 'icono': '🍲', 'esPropio': True},
        {'nombre': 'Pastel de Choclo en Greda', 'descripcion': 'Tradicional receta horneada con pino de carne, pollo y albahaca.', 'precio': 7000, 'categoria': 'platos', 'icono': '🥧', 'esPropio': True},
        {'nombre': 'Lomo a lo Pobre Ejecutivo', 'descripcion': 'Bife tierno con papas fritas caseras, cebolla y dos huevos fritos.', 'precio': 7900, 'categoria': 'platos', 'icono': '🥩', 'esPropio': True},
        
        # Categoría: Bebestibles
        {'nombre': 'Jugo Natural del Día (350cc)', 'descripcion': 'Fruta fresca de la estación (Frambuesa, lúcuma o piña).', 'precio': 2200, 'categoria': 'bebestibles', 'icono': '🧃', 'esPropio': True},
        {'nombre': 'Bebida en Lata 350ml', 'descripcion': 'Coca-Cola, Coca-Cola Zero, Sprite o Fanta.', 'precio': 1800, 'categoria': 'bebestibles', 'icono': '🥤', 'esPropio': False},
        
        # Categoría: Postres
        {'nombre': 'Leche Asada Casera', 'descripcion': 'Receta tradicional con caramelo artesanal.', 'precio': 2500, 'categoria': 'postres', 'icono': '🍮', 'esPropio': True},
        {'nombre': 'Panqueque con Manjar (2 unid.)', 'descripcion': 'Panqueques caseros rellenos de manjar chileno.', 'precio': 2600, 'categoria': 'postres', 'icono': '🥞', 'esPropio': True},
        
        # Categoría: Extras
        {'nombre': 'Porción de Papas Fritas', 'descripcion': 'Papas cortadas a mano y crujientes.', 'precio': 3000, 'categoria': 'extras', 'icono': '🍟', 'esPropio': True},
        {'nombre': 'Sopaipillas con Pebre Casero', 'descripcion': 'Sopaipillas pasadas o al plato acompañadas de pebre fresco.', 'precio': 2500, 'categoria': 'extras', 'icono': '🫓', 'esPropio': True},
    ]

    print("Iniciando carga de platos en MySQL...")
    
    # Recorremos la lista y creamos los registros
    for p in platos_demo:
        # get_or_create evita que se dupliquen si corres el script dos veces
        obj, created = Plato.objects.get_or_create(
            nombre=p['nombre'],
            defaults={
                'descripcion': p['descripcion'],
                'precio': p['precio'],
                'categoria': p['categoria'],
                'icono': p['icono'],
                'esPropio': p['esPropio']
            }
        )
        if created:
            print(f"✅ Agregado: {p['nombre']}")
        else:
            print(f"⏩ Ya existía: {p['nombre']}")

    print("¡Base de datos poblada con éxito!")

if __name__ == '__main__':
    poblar_bd()