# Guía de Despliegue de Ecoaisla

Esta guía proporciona instrucciones detalladas para desplegar el sitio web de Ecoaisla en producción.

## Requisitos Previos

- Acceso al servidor de producción (FTP/SFTP o panel de control)
- Credenciales de base de datos (si es aplicable)
- Certificado SSL (recomendado para HTTPS)
- Dominio configurado (ej: www.ecoaisla.com)

## Pasos de Despliegue

### 1. Preparación del Entorno

1. **Clonar el repositorio** en el servidor o máquina local:
   ```bash
   git clone https://github.com/tu-usuario/ecoaisla.com.git
   cd ecoaisla.com
   ```

2. **Instalar dependencias** (solo si usas Node.js para el build):
   ```bash
   npm install
   ```

### 2. Construir para Producción

1. **Ejecutar el script de construcción**:
   ```bash
   npm run build
   ```
   Esto generará los archivos optimizados en el directorio `dist/`.

### 3. Configuración del Servidor Web

1. **Configurar el servidor web** (ejemplo para Nginx):
   ```nginx
   server {
       listen 80;
       server_name ecoaisla.com www.ecoaisla.com;
       root /ruta/a/ecoaisla.com/dist;
       index index.html;

       # Redirección a HTTPS (recomendado)
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name ecoaisla.com www.ecoaisla.com;
       root /ruta/a/ecoaisla.com/dist;
       index index.html;

       # Configuración SSL
       ssl_certificate /ruta/al/certificado.crt;
       ssl_certificate_key /ruta/a/la/clave_privada.key;
       
       # Configuración de seguridad
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Frame-Options "SAMEORIGIN";
       
       # Configuración de caché
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg|eot)$ {
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }
       
       # Configuración para SPA (Single Page Application)
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### 4. Subir Archivos al Servidor

1. **Subir archivos** al directorio raíz del servidor web:
   - Usando SCP:
     ```bash
     scp -r dist/* usuario@servidor:/ruta/al/directorio/web/
     ```
   - O usando un cliente FTP como FileZilla

### 5. Verificaciones Posteriores al Despliegue

1. **Verificar HTTPS**:
   - Asegúrate de que el sitio se carga correctamente con HTTPS
   - Verifica que no haya contenido mixto (HTTP dentro de HTTPS)

2. **Pruebas de rendimiento**:
   - Usa PageSpeed Insights: https://pagespeed.web.dev/
   - Verifica la puntuación de Lighthouse en Chrome DevTools

3. **Verificar SEO**:
   - Comprueba que el archivo robots.txt sea accesible
   - Verifica el sitemap.xml
   - Usa la Herramienta de Inspección de URLs de Google Search Console

4. **Pruebas de compatibilidad**:
   - Navegadores: Chrome, Firefox, Safari, Edge
   - Dispositivos: móvil, tablet, escritorio
   - Sistemas operativos: Windows, macOS, iOS, Android

### 6. Monitoreo Post-Despliegue

1. **Configurar monitoreo** (opcional pero recomendado):
   - Google Analytics
   - Google Search Console
   - Monitoreo de errores (ej: Sentry)
   - Monitoreo de rendimiento

2. **Configurar copias de seguridad** automáticas del sitio web y la base de datos (si aplica).

## Actualizaciones Futuras

Para actualizar el sitio en el futuro:

1. Hacer pull de los últimos cambios:
   ```bash
   git pull origin main
   ```

2. Reconstruir la aplicación:
   ```bash
   npm run build
   ```

3. Subir los archivos actualizados al servidor.

## Solución de Problemas Comunes

- **Error 404 en rutas de la aplicación**: Asegúrate de que la configuración del servidor web redirija todas las rutas a index.html (ver configuración de SPA arriba).
  
- **Problemas de caché**: Agrega un parámetro de versión a los recursos estáticos o configura encabezados de caché adecuados.

- **Problemas de rendimiento**: Revisa las recomendaciones de PageSpeed Insights y Lighthouse.

## Contacto

Para soporte técnico, contacta al equipo de desarrollo en soporte@ecoaisla.com
