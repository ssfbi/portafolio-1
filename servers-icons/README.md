# servers-icons

Coloca aquí los logos PNG de tus servidores y hostings.

## Importante (error típico)
Si el logo no carga, normalmente es por la ruta del archivo en `assets/servers-config.js`.

### Formas válidas para `icon`
- Con carpeta: `servers-icons/sapphirehost.png`
- Solo nombre: `sapphirehost.png` (el sistema intentará automáticamente `servers-icons/`)

## Configuración
1. Sube tus PNG en esta carpeta.
2. Edita `assets/servers-config.js`.
3. Usa esta estructura:
   - `hostings`: lista separada de hostings.
   - `servers`: lista separada de servidores (actualmente 12).
4. En cada item puedes definir:
   - `name`
   - `role`
   - `icon` (ruta o nombre PNG)
   - `fallback` (texto si no carga la imagen)
