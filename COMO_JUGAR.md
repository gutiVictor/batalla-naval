# 🎮 Cómo Jugar - Batalla Naval

## 🚀 Inicio Rápido

### Paso 1: Asegúrate que ambos servidores estén corriendo

✅ **Frontend**: http://localhost:3000  
✅ **Backend**: Puerto 4000

### Paso 2: Conectar DOS jugadores

**IMPORTANTE**: El juego requiere exactamente **2 jugadores** para comenzar.

1. Abre **dos pestañas** del navegador en http://localhost:3000
2. Espera a que ambas se conecten (verás "Esperando a otro jugador..." en la primera)
3. Cuando la segunda pestaña se conecte, ambos jugadores recibirán su rol

### Paso 3: Colocar Barcos

Cada jugador debe colocar sus barcos:

- **Opción 1**: Haz clic en las celdas de tu tablero para colocar/quitar barcos manualmente
- **Opción 2**: Usa el botón **🎲 Colocación Aleatoria** para generar posiciones automáticas
- **Opción 3**: Usa **🗑️ Limpiar Tablero** si quieres empezar de nuevo

Cuando estés listo, presiona **✅ Listo**

### Paso 4: Esperar al Oponente

Verás el mensaje "Esperando al oponente..." hasta que el otro jugador también presione "Listo"

### Paso 5: ¡Jugar!

- Cuando sea tu turno, verás **🎯 ¡TU TURNO!**
- Haz clic en una celda del **Tablero Enemigo** para disparar
- Verás:
  - 🔥 = Impacto
  - 💧 = Fallo
  - 💥 = Barco hundido (todas las partes destruidas)

---

## 📋 Reglas del Juego

### Tableros

**Tu Tablero (izquierda)**:
- Muestra TUS barcos (🚢)
- Muestra los disparos del oponente
- Solo TÚ puedes ver tus barcos

**Tablero Enemigo (derecha)**:
- NO muestra los barcos del oponente (están ocultos)
- Solo muestra tus disparos y sus resultados
- Haz clic aquí para atacar

### Turnos

- Los jugadores se turnan para disparar
- Después de cada disparo, el turno pasa al otro jugador
- No puedes disparar dos veces al mismo lugar

### Victoria

- Ganas cuando hundes TODOS los barcos enemigos
- Verás una pantalla de victoria con confetti 🎊
- Puedes presionar **🔄 Jugar de Nuevo** para reiniciar

---

## 🎨 Características Visuales

### Animaciones
- ✨ Explosiones al impactar
- 💧 Salpicaduras al fallar
- 🌊 Fondo oceánico animado
- 🎊 Confetti en victorias

### Sonidos
- 🎯 Disparo
- 💥 Impacto
- 💧 Fallo
- 🚢 Barco hundido
- 🏆 Victoria
- 💀 Derrota

**Control de audio**: Usa el botón 🔊 en la esquina superior derecha

---

## ❓ Solución de Problemas

### "Conectando..." no cambia

**Causa**: Solo hay 1 jugador conectado  
**Solución**: Abre una segunda pestaña. El juego necesita 2 jugadores para comenzar.

### "El oponente se fue"

**Causa**: El otro jugador cerró su pestaña  
**Solución**: Recarga la página y espera a que se conecte otro jugador

### No puedo disparar

**Causa**: No es tu turno  
**Solución**: Espera a que el indicador muestre "🎯 ¡TU TURNO!"

### Los tableros se ven vacíos

**Causa**: Aún no has colocado barcos  
**Solución**: Usa "🎲 Colocación Aleatoria" o coloca barcos manualmente

---

## 🎯 Consejos

1. **Usa colocación aleatoria** para empezar rápido
2. **Activa el sonido** para mejor experiencia
3. **Espera tu turno** - el indicador es muy claro
4. **Recuerda**: Solo ves TUS barcos, no los del enemigo
5. **Estrategia**: Cuando aciertas, dispara alrededor para hundir el barco completo

---

## 🔧 Información Técnica

- **Frontend**: React + Framer Motion + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO
- **Comunicación**: WebSockets en tiempo real
- **Puerto Frontend**: 3000
- **Puerto Backend**: 4000

¡Disfruta del juego! ⚓🎮

desesta menra de juego
