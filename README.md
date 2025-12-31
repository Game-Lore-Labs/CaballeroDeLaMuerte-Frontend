# RPG Frontend - El Escudero del Caballero de la Muerte

Frontend para el juego de rol interactivo "El Escudero del Caballero de la Muerte", implementado con React y un diseño visual inspirado en Pathfinder: Wrath of the Righteous.

## 🎮 Características

- **Interfaz RPG clásica** con estilo medieval/pergamino
- **Navegación por pestañas** en barra superior:
  - 📖 Aventura - Panel principal de narrativa
  - 👤 Personaje - Hoja de personaje completa
  - 🎒 Inventario - Dispensario medieval
  - 🔍 Pistas - Diario de pistas descubiertas
  - 📜 Historial - Timeline de la aventura
- **Sistema de combate** con interfaz visual
- **Integración completa** con el backend Haskell/Scotty

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── layout/          # Componentes de estructura (TopNavbar, MainLayout)
│   ├── ui/              # Componentes reutilizables (Button, Panel, StatBar)
│   ├── character/       # Componentes de personaje (CharacterSheet, Inventory)
│   └── game/            # Componentes del juego (AdventurePanel, CombatPanel)
├── context/             # Context API (GameContext)
├── hooks/               # Custom hooks
├── pages/               # Páginas principales (GamePage)
├── services/            # Servicios API
├── styles/              # Estilos globales y tema
└── utils/               # Utilidades y constantes
```

## 🎨 Diseño Visual

### Paleta de Colores

- **Pergamino**: `#f4e4bc` a `#c4a878` - Para paneles de narrativa
- **Oro/Dorado**: `#ffd700` a `#7a6420` - Acentos y bordes
- **Oscuros**: `#1a1410` a `#4a3c2e` - Fondos y paneles
- **Estados**: Rojo (daño), Verde (salud), Púrpura (arcano)

### Tipografías

- **Cinzel** - Títulos y encabezados
- **Cormorant Garamond** - Texto narrativo
- **MedievalSharp** - Elementos decorativos

## 🚀 Instalación

```bash
# Clonar el repositorio
cd rpg-frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

## 🔧 Configuración

El frontend se conecta al backend en `http://localhost:3000`. Para cambiar esto, crea un archivo `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

## 📡 API Endpoints Utilizados

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/game/load` | POST | Cargar partida |
| `/game/save` | POST | Guardar partida |
| `/game/state` | GET | Obtener estado |
| `/entry/current` | GET | Entrada actual |
| `/entry/select` | POST | Seleccionar opción |
| `/character` | GET | Info de personaje |
| `/combat/status` | GET | Estado de combate |
| `/combat/attack` | POST | Atacar enemigo |
| `/combat/enemy-turn` | POST | Turno enemigos |
| `/combat/end` | POST | Finalizar combate |

## 📂 Estructura de Componentes

### Layout
- `MainLayout` - Contenedor principal con fondo y navegación
- `TopNavbar` - Barra de navegación horizontal superior

### UI
- `Button` - Botón estilizado con variantes
- `Panel` - Panel decorativo (dark, parchment, gold)
- `StatBar` - Barras de estadísticas (vida, maná, XP)
- `Notification` - Sistema de notificaciones toast

### Character
- `CharacterSheet` - Hoja de personaje completa con atributos y habilidades
- `Inventory` - Sistema de inventario tipo dispensario
- `CluesPanel` - Panel de pistas descubiertas
- `HistoryPanel` - Timeline de la aventura

### Game
- `AdventurePanel` - Panel de narrativa y opciones
- `CombatPanel` - Interfaz de combate

## 🎲 Mecánicas D&D 5e Soportadas

- Sistema d20 con bonificadores
- Atributos (FUE, DES, CON, INT, SAB, CAR)
- 18 habilidades con competencia/pericia
- Tiradas de salvación
- Sistema de combate por turnos
- Clase de Armadura (CA)
- Puntos de Vida

## 📜 Licencia

MIT License - Proyecto educativo MATCOM
