# 🚢 Batalla Naval - Juego Multijugador

Juego de batalla naval en tiempo real para dos jugadores, construido con React, Node.js, Express y Socket.IO.

## 🎮 Características

- ✅ Juego multijugador en tiempo real
- ✅ Sistema de emparejamiento automático
- ✅ Interfaz moderna y animada con Framer Motion
- ✅ Efectos de sonido con Howler.js
- ✅ Efectos visuales de confeti al ganar
- ✅ Colocación aleatoria de barcos
- ✅ Diseño responsive

## 🛠️ Tecnologías

### Frontend
- React 19
- Socket.IO Client
- Framer Motion (animaciones)
- Howler.js (sonidos)
- Canvas Confetti (efectos visuales)
- React Icons

### Backend
- Node.js
- Express
- Socket.IO
- CORS

## 🚀 Instalación y Uso

### Requisitos previos
- Node.js (v14 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/gutiVictor/batalla-naval.git
cd batalla-naval
```

2. Instala las dependencias del backend:
```bash
npm install
```

3. Instala las dependencias del frontend:
```bash
cd frontend
npm install
cd ..
```

### Ejecución en desarrollo

1. Inicia el servidor backend (en una terminal):
```bash
node backend/index.js
```
El servidor se ejecutará en `http://localhost:4000`

2. Inicia el frontend (en otra terminal):
```bash
cd frontend
npm start
```
El frontend se ejecutará en `http://localhost:3000`

## 🎯 Cómo Jugar

1. Abre el juego en tu navegador
2. Espera a que otro jugador se conecte
3. Coloca tus barcos en el tablero (o usa colocación aleatoria)
4. ¡Dispara a los barcos enemigos por turnos!
5. El primer jugador en hundir todos los barcos enemigos gana

## 📦 Tipos de Barcos

- **Portaaviones** (5 casillas)
- **Acorazado** (4 casillas)
- **Crucero** (3 casillas)
- **Submarino** (3 casillas)
- **Destructor** (2 casillas)

## 🌐 Deploy

Este proyecto está configurado para desplegarse en Render.com

## 📝 Licencia

MIT

## 👨‍💻 Autor

gutiVictor
