const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.send('Servidor de Batalla Naval funcionando');
});

// Estado de las partidas
const games = {};
let waitingPlayer = null;

io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado:', socket.id);

  // Emparejamiento de jugadores
  if (waitingPlayer) {
    // Crear una sala única para los dos jugadores
    const roomId = `room-${waitingPlayer.id}-${socket.id}`;
    socket.join(roomId);
    waitingPlayer.join(roomId);

    // Inicializar estado del juego
    games[roomId] = {
      players: [waitingPlayer.id, socket.id],
      boards: {}, // Aquí se guardarán los tableros de cada jugador
      ready: {},
      turn: waitingPlayer.id, // El primero en entrar empieza
    };

    // Asignar roles
    io.to(waitingPlayer.id).emit('role', { role: 'jugador1', roomId });
    io.to(socket.id).emit('role', { role: 'jugador2', roomId });

    // Notificar a ambos que pueden colocar barcos
    io.to(roomId).emit('waiting_for_ships');

    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    socket.emit('waiting', 'Esperando a otro jugador...');
  }

  // Recibir tablero de barcos de un jugador
  socket.on('place_ships', ({ roomId, board }) => {
    if (!games[roomId]) return;
    games[roomId].boards[socket.id] = board;
    games[roomId].ready[socket.id] = true;

    // Notificar al jugador que su tablero fue recibido
    socket.emit('ships_placed');

    // Si ambos jugadores están listos, iniciar el juego
    if (
      Object.keys(games[roomId].ready).length === 2 &&
      games[roomId].ready[games[roomId].players[0]] &&
      games[roomId].ready[games[roomId].players[1]]
    ) {
      io.to(roomId).emit('game_start', { turn: games[roomId].turn });
    }
  });

  // Manejar disparos
  socket.on('fire', ({ roomId, x, y }) => {
    const game = games[roomId];
    if (!game) return;
    if (game.turn !== socket.id) return; // No es el turno de este jugador

    // Identificar oponente
    const opponentId = game.players.find((id) => id !== socket.id);
    const opponentBoard = game.boards[opponentId];
    if (!opponentBoard) return;

    // Validar disparo
    const cell = opponentBoard[y][x];
    let result = 'miss';
    if (cell === 1) {
      opponentBoard[y][x] = 2; // 2 = tocado
      result = 'hit';
    } else if (cell === 0) {
      opponentBoard[y][x] = 3; // 3 = agua disparada
    }

    // Verificar victoria
    const hasShips = opponentBoard.flat().includes(1);
    if (!hasShips) {
      io.to(roomId).emit('game_over', { winner: socket.id });
      delete games[roomId];
      return;
    }

    // Notificar resultado a ambos jugadores
    io.to(socket.id).emit('fire_result', { x, y, result, yourTurn: false });
    io.to(opponentId).emit('fire_result', { x, y, result, yourTurn: true });

    // Cambiar turno
    game.turn = opponentId;
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
    // Limpiar si era el jugador en espera
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
    // Eliminar de cualquier sala activa
    for (const roomId in games) {
      if (games[roomId].players.includes(socket.id)) {
        io.to(roomId).emit('opponent_left');
        delete games[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
}); 