# Backend Notuno

Este repositorio contiene el backend de la aplicación Notuno.

## Estructura principal

- `backend/`
  - `src/` – código fuente del backend
  - `src/app.js` – configuración de Express y rutas
  - `src/server.js` – arranque del servidor y sockets
  - `src/config/db.js` – conexión PostgreSQL
  - `src/database/01_schema.sql` – esquema de base de datos
  - `src/database/02_seed.sql` – datos semilla
  - `src/core/game-engine/` – motor de juego y lógica de cartas
  - `src/modules/` – módulos de dominio (auth, user, friends, wallet, store, chat, game, rol)
  - `src/realtime/` – WebSockets y gestión de salas
  - `test/` – tests automatizados y scripts de prueba

## Documentación existente

- `BACKEND_RUN_STEPS.txt` – pasos para instalar dependencias y arrancar el backend
- `ARCHITECTURE_OVERVIEW.txt` – descripción de la arquitectura de capas
- `diagrama_modulos.txt` – visión general de los módulos
- `estructura proyecto +-.txt` – estructura actual del proyecto

## Cómo arrancar

1. Abrir terminal en `backend/`
2. Ejecutar `npm install`
3. Crear/editar `backend/.env` con variables de entorno necesarias:
   - `JWT_SECRET`
   - `PORT`
   - `DATABASE_URL`
4. Inicializar base de datos si es necesario:
   - `node src/init-db.js`
5. Arrancar el servidor:
   - `npm run dev`

## Pruebas

- Se está usando `test/` para tests automáticos y scripts de integración.
- Por ahora no hay un runner de tests configurado en `package.json`.

## Notas

- El backend usa PostgreSQL y está preparado para conexiones SSL (Neon u otras bases en la nube).
- El módulo de partidas gestiona la fase de lobby y el estado del juego.
- Las reglas de cartas y efectos se encuentran en `src/core/game-engine/`.
