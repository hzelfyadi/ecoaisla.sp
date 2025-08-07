# Lista de Verificación de Despliegue

## Antes del Despliegue

- [ ] **Configuración del Dominio**
  - [ ] Dominio registrado (ej: ecoaisla.com)
  - [ ] DNS configurado correctamente
  - [ ] Certificado SSL instalado

- [ **Configuración del Servidor**
  - [ ] Servidor web instalado (Nginx/Apache)
  - [ ] PHP instalado (si es necesario)
  - [ ] Base de datos configurada (si es necesaria)
  - [ ] Permisos de archivos y directorios configurados

## Despliegue

- [ ] **Preparación de Archivos**
  - [ ] Ejecutar `npm install` para instalar dependencias
  - [ ] Ejecutar `npm run build` para generar archivos de producción
  - [ ] Verificar que la carpeta `dist/` se haya generado correctamente

- [ ] **Subida de Archivos**
  - [ ] Subir contenido de `dist/` al directorio raíz del servidor web
  - [ ] Verificar que todos los archivos se hayan subido correctamente

## Verificación Post-Despliegue

- [ ] **Funcionalidad Básica**
  - [ ] La página principal carga correctamente
  - [ ] Los enlaces de navegación funcionan
  - [ ] Los formularios funcionan correctamente
  - [ ] Las imágenes y recursos se cargan correctamente

- [ ] **Rendimiento**
  - [ ] El sitio se carga rápidamente (<3 segundos)
  - [ ] Las imágenes están optimizadas
  - [ ] Los recursos estáticos tienen encabezados de caché

- [ ] **Seguridad**
  - [ ] El sitio redirige de HTTP a HTTPS
  - [ ] No hay contenido mixto (HTTP dentro de HTTPS)
  - [ ] Headers de seguridad configurados (CSP, XSS Protection, etc.)

- [ ] **SEO**
  - [ ] `robots.txt` accesible
  - [ ] `sitemap.xml` accesible
  - [ ] Metaetiquetas configuradas correctamente
  - [ ] URLs amigables funcionando

- [ ] **Compatibilidad**
  - [ ] Pruebas en diferentes navegadores (Chrome, Firefox, Safari, Edge)
  - [ ] Pruebas en dispositivos móviles
  - [ ] Pruebas en diferentes tamaños de pantalla

## Monitoreo Post-Despliegue

- [ ] **Herramientas de Monitoreo**
  - [ ] Google Analytics configurado
  - [ ] Google Search Console verificado
  - [ ] Monitoreo de errores configurado (opcional)

- [ ] **Copia de Seguridad**
  - [ ] Sistema de copias de seguridad configurado
  - [ ] Proceso de restauración probado

## Tareas Posteriores al Lanzamiento

- [ ] **Marketing y Promoción**
  - [ ] Anunciar el lanzamiento en redes sociales
  - [ ] Enviar correo electrónico a la lista de suscriptores (si aplica)
  - [ ] Actualizar perfiles en redes sociales con el nuevo sitio

- [ ] **Mantenimiento**
  - [ ] Establecer un calendario de actualizaciones
  - [ ] Monitorear el rendimiento regularmente
  - [ ] Revisar informes de errores y métricas

## Contacto de Emergencia

En caso de problemas críticos después del despliegue, contactar:

- **Soporte Técnico**: soporte@ecoaisla.com
- **Teléfono de Emergencia**: +34 XXX XXX XXX
- **Horario de Atención**: Lunes a Viernes, 9:00 - 18:00
