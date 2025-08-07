# Ecoaisla - Aislamiento Térmico por 1€

Sitio web oficial de Ecoaisla, especialistas en aislamiento térmico de áticos con ayudas públicas.

## Características

- Diseño moderno y responsivo
- Formulario de contacto con validación
- Sección de beneficios con tarjetas interactivas
- Proceso de solicitud paso a paso
- Preguntas frecuentes
- Optimizado para SEO

## Requisitos del Sistema

- Node.js 14.x o superior
- npm 6.x o superior

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/ecoaisla.com.git
   cd ecoaisla.com
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Desarrollo

Para iniciar un servidor de desarrollo con recarga en caliente:

```bash
npm start
```

El sitio estará disponible en `http://localhost:3000`

## Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`.

## Estructura del Proyecto

```
├── css/                  # Hojas de estilo
├── dist/                 # Archivos de producción (generados)
├── images/               # Imágenes del sitio
├── js/                   # Scripts JavaScript
├── index.html            # Página principal
├── build.js              # Script de construcción
├── package.json          # Dependencias y scripts
└── README.md             # Este archivo
```

## Optimizaciones

- **Rendimiento**: Carga diferida de imágenes, CSS/JS minimizados
- **SEO**: Metaetiquetas optimizadas, sitemap.xml, robots.txt
- **Accesibilidad**: Compatible con lectores de pantalla, contraste adecuado
- **Responsive**: Diseño adaptable a todos los dispositivos

## Despliegue

1. Ejecuta el comando de construcción:
   ```bash
   npm run build
   ```

2. Sube el contenido del directorio `dist/` a tu servidor web.

## Licencia

© 2025 Ecoaisla. Todos los derechos reservados.
