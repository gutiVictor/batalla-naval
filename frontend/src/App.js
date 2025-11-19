import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { GiShipBow, GiCrossedSwords, GiTrophy } from 'react-icons/gi';
import { FaAnchor, FaSkull, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { soundManager } from './soundManager';
import './App.css';

const socket = io('http://localhost:4000');

const BOARD_SIZE = 10;

const SHIP_TYPES = [
  { id: 'carrier', name: 'Portaaviones', size: 5, emoji: '🚢', color: '#ff6b6b' },
  { id: 'battleship', name: 'Acorazado', size: 4, emoji: '🛳️', color: '#4ecdc4' },
  { id: 'cruiser', name: 'Crucero', size: 3, emoji: '⛴️', color: '#45b7d1' },
  { id: 'submarine', name: 'Submarino', size: 3, emoji: '🚤', color: '#96ceb4' },
  { id: 'destroyer', name: 'Destructor', size: 2, emoji: '🛥️', color: '#ffeaa7' }
];

function findShips(board) {
  const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
  const ships = [];

  function getCellValue(cell) {
    if (typeof cell === 'object' && cell !== null) {
      return cell.value;
    }
    return cell;
  }

  function dfs(x, y, ship) {
    if (
      x < 0 ||
      y < 0 ||
      x >= BOARD_SIZE ||
      y >= BOARD_SIZE ||
      visited[y][x]
    ) {
      return;
    }
    const cellValue = getCellValue(board[y][x]);
    if (cellValue !== 1 && cellValue !== 2) {
      return;
    }
    visited[y][x] = true;
    ship.push([x, y]);
    dfs(x + 1, y, ship);
    dfs(x - 1, y, ship);
    dfs(x, y + 1, ship);
    dfs(x, y - 1, ship);
  }

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cellValue = getCellValue(board[y][x]);
      if (!visited[y][x] && (cellValue === 1 || cellValue === 2)) {
        const ship = [];
        dfs(x, y, ship);
        if (ship.length > 0) ships.push(ship);
      }
    }
  }
  return ships;
}

function countShips(board, sunk = false) {
  const getCellValue = (cell) => typeof cell === 'object' && cell !== null ? cell.value : cell;
  const ships = findShips(board);
  if (sunk) {
    return ships.filter((ship) => ship.every(([x, y]) => getCellValue(board[y][x]) === 2)).length;
  } else {
    return ships.filter((ship) => !ship.every(([x, y]) => getCellValue(board[y][x]) === 2)).length;
  }
}

function Board({ board, title, isOwn, onCellClick, disabled, flashCell, shipCount, sunkCount }) {
  const getCellValue = (cell) => typeof cell === 'object' && cell !== null ? cell.value : cell;
  let sunkCells = [];
  if (isOwn || (!isOwn && title === 'Tablero enemigo')) {
    const ships = findShips(board);
    ships.forEach((ship) => {
      if (ship.every(([x, y]) => getCellValue(board[y][x]) === 2)) {
        sunkCells = sunkCells.concat(ship);
      }
    });
  }

  return (
    <motion.div 
      className="board-wrapper"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="board-title">
        {isOwn ? <FaAnchor style={{ marginRight: 10 }} /> : <GiCrossedSwords style={{ marginRight: 10 }} />}
        {title}
      </h3>
      {typeof shipCount === 'number' && (
        <div className="board-stats">
          <div className="stat-item">
            <GiShipBow />
            <span>{isOwn ? `Restantes: ${shipCount}` : `Hundidos: ${sunkCount}`}</span>
          </div>
        </div>
      )}
      <table className="board-table">
        <tbody>
          {board.map((row, y) => (
            <tr key={y}>
              {row.map((cell, x) => {
                const isSunk = sunkCells.some(([sx, sy]) => sx === x && sy === y);
                const isFlash = flashCell && flashCell[0] === x && flashCell[1] === y;
                const cellValue = getCellValue(cell);
                
                let cellClass = 'board-cell';
                if (disabled) cellClass += ' disabled';
                if (isOwn) cellClass += ' own-cell';
                else cellClass += ' enemy-cell';
                if (isFlash) cellClass += ' flash';
                if (isSunk) cellClass += ' sunk';
                else if (isOwn && cellValue === 1) cellClass += ' ship';
                else if (cellValue === 2) cellClass += ' hit';
                else if (cellValue === 3) cellClass += ' miss';

                let content = null;
                let cellStyle = {};
                
                // Get ship type if cell contains ship data
                const cellData = typeof cell === 'object' ? cell : null;
                const shipType = cellData?.shipType;
                
                if (isOwn && (cell === 1 || cellData?.value === 1)) {
                  content = shipType ? shipType.emoji : '🚢';
                  if (shipType) {
                    cellStyle.backgroundColor = shipType.color + '40'; // 40 = 25% opacity
                  }
                }
                if (isSunk && ((cell === 1 || cell === 2) || (cellData?.value === 1 || cellData?.value === 2))) {
                  content = '💥';
                }
                if ((cell === 2 || cellData?.value === 2) && !isSunk) {
                  content = '🔥';
                }
                if (cell === 3 || cellData?.value === 3) {
                  content = '💧';
                }

                return (
                  <motion.td
                    key={x}
                    className={cellClass}
                    style={cellStyle}
                    whileHover={!disabled ? { scale: 1.1, y: -3 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    onClick={() => isOwn && !disabled && onCellClick && onCellClick(x, y)}
                    onMouseDown={() => !isOwn && !disabled && onCellClick && onCellClick(x, y)}
                  >
                    {content}
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function App() {
  const [status, setStatus] = useState('Conectando...');
  const [role, setRole] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [yourTurn, setYourTurn] = useState(false);
  const [placingShips, setPlacingShips] = useState(false);
  const [shipsSent, setShipsSent] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const exampleBoard = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
  exampleBoard[0][0] = 1;

  const [ownBoard, setOwnBoard] = useState(exampleBoard);
  const [enemyBoard, setEnemyBoard] = useState(Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0)));
  const [shotsFired, setShotsFired] = useState([]);
  const [flashCell, setFlashCell] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedShipType, setSelectedShipType] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const flashTimeout = useRef(null);
  const prevOwnShipsRef = useRef(0);
  const prevEnemyShipsRef = useRef(0);

  // Confetti effect on victory
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#1eb2a6', '#247ba0']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#1eb2a6', '#247ba0']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    // Connection status
    socket.on('connect', () => {
      console.log('Conectado al servidor');
      setStatus('Conectado. Buscando oponente...');
      // Enable ship placement immediately
      setPlacingShips(true);
    });
    
    socket.on('disconnect', () => {
      setStatus('Desconectado del servidor');
    });
    
    socket.on('waiting', (msg) => {
      setStatus(msg);
      // Enable ship placement while waiting
      setPlacingShips(true);
    });
    socket.on('role', ({ role, roomId }) => {
      setRole(role);
      setRoomId(roomId);
      setStatus(`Eres ${role}. Esperando para colocar barcos...`);
    });
    socket.on('waiting_for_ships', () => {
      setStatus('Coloca tus barcos (haz clic en las celdas para poner/quitar barcos y presiona "Listo")');
      setPlacingShips(true);
    });
    socket.on('ships_placed', () => {
      setStatus('Esperando al oponente...');
      setShipsSent(true);
      setPlacingShips(false);
    });
    socket.on('game_start', ({ turn }) => {
      setGameStarted(true);
      setStatus('¡El juego ha comenzado!');
      setYourTurn(socket.id === turn);
    });
    socket.on('fire_result', ({ x, y, result, yourTurn }) => {
      setYourTurn(yourTurn);
      setStatus(yourTurn ? '¡Es tu turno!' : 'Turno del oponente');
      
      // Play sound based on result
      if (result === 'hit') {
        soundManager.play('hit');
      } else if (result === 'miss') {
        soundManager.play('miss');
      }
      
      if (yourTurn === false) {
        setEnemyBoard((prev) => {
          const newBoard = prev.map((row) => [...row]);
          if (result === 'hit') newBoard[y][x] = 2;
          else if (result === 'miss') newBoard[y][x] = 3;
          return newBoard;
        });
        setShotsFired((prev) => [...prev, `${x},${y}`]);
      }
      
      if (yourTurn === true) {
        setOwnBoard((prev) => {
          const newBoard = prev.map((row) => [...row]);
          if (result === 'hit') newBoard[y][x] = 2;
          else if (result === 'miss') newBoard[y][x] = 3;
          return newBoard;
        });
      }
    });
    socket.on('game_over', ({ winner }) => {
      setStatus(winner === socket.id ? '¡Ganaste!' : 'Perdiste.');
      setGameStarted(false);
      setGameOver(true);
      setWinner(winner);
      if (winner === socket.id) {
        triggerConfetti();
        soundManager.play('victory');
      } else {
        soundManager.play('defeat');
      }
    });
    socket.on('opponent_left', () => {
      setStatus('El oponente se fue. Recarga la página para jugar de nuevo.');
      setGameStarted(false);
    });
    return () => {
      socket.off();
    };
  }, [roomId, ownBoard]);

  // Calculate ship counts
  const ownShipsLeft = countShips(ownBoard, false);
  const enemyShipsSunk = countShips(enemyBoard, true);

  // Detect when ships are sunk and play sound
  useEffect(() => {
    if (gameStarted) {
      // Check if enemy ship was sunk
      if (enemyShipsSunk > prevEnemyShipsRef.current) {
        soundManager.play('sunk');
      }
      prevEnemyShipsRef.current = enemyShipsSunk;
      
      // Check if own ship was sunk
      if (ownShipsLeft < prevOwnShipsRef.current) {
        soundManager.play('sunk');
      }
      prevOwnShipsRef.current = ownShipsLeft;
    }
  }, [enemyShipsSunk, ownShipsLeft, gameStarted]);

  const handleCellClick = (x, y) => {
    if (!placingShips || shipsSent) return;
    
    setOwnBoard((prev) => {
      const newBoard = prev.map((row) => [...row]);
      const cellValue = typeof newBoard[y][x] === 'object' ? newBoard[y][x].value : newBoard[y][x];
      
      if (cellValue === 1) {
        // Remove ship
        newBoard[y][x] = 0;
      } else if (selectedShipType) {
        // Place ship with selected type
        newBoard[y][x] = { value: 1, shipType: selectedShipType };
      } else {
        // No ship type selected, place generic ship
        newBoard[y][x] = 1;
      }
      return newBoard;
    });
  };

  const handleSendShips = () => {
    if (!roomId) return;
    // Convert board to simple format for backend
    const simpleBoard = ownBoard.map(row => 
      row.map(cell => typeof cell === 'object' && cell !== null ? cell.value : cell)
    );
    socket.emit('place_ships', { roomId, board: simpleBoard });
    setShipsSent(true);
    setPlacingShips(false);
  };

  const handleRandomPlacement = () => {
    const newBoard = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    const shipsToPlace = [...SHIP_TYPES]; // Copy ship types array
    
    shipsToPlace.forEach(shipType => {
      let placed = false;
      while (!placed) {
        const horizontal = Math.random() > 0.5;
        const x = Math.floor(Math.random() * (horizontal ? BOARD_SIZE - shipType.size : BOARD_SIZE));
        const y = Math.floor(Math.random() * (horizontal ? BOARD_SIZE : BOARD_SIZE - shipType.size));
        
        let canPlace = true;
        for (let i = 0; i < shipType.size; i++) {
          const checkX = horizontal ? x + i : x;
          const checkY = horizontal ? y : y + i;
          const cellValue = typeof newBoard[checkY][checkX] === 'object' ? newBoard[checkY][checkX].value : newBoard[checkY][checkX];
          if (cellValue === 1) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < shipType.size; i++) {
            const placeX = horizontal ? x + i : x;
            const placeY = horizontal ? y : y + i;
            newBoard[placeY][placeX] = { value: 1, shipType };
          }
          placed = true;
        }
      }
    });
    
    setOwnBoard(newBoard);
    setPlacedShips([...SHIP_TYPES]); // All ships are placed
  };

  const handleClearBoard = () => {
    setOwnBoard(Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0)));
    setPlacedShips([]);
    setSelectedShipType(null);
  };

  const handleEnemyCellClick = (x, y) => {
    if (!gameStarted || !yourTurn || !roomId) return;
    if (shotsFired.includes(`${x},${y}`)) return;
    soundManager.play('shot');
    setFlashCell([x, y]);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlashCell(null), 300);
    socket.emit('fire', { roomId, x, y });
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };


  return (
    <div className="App">
      <div className="ocean-background" />
      
      <motion.h1 
        className="game-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ⚓ BATALLA NAVAL ⚓
      </motion.h1>

      <motion.div 
        className="status-panel"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="status-text">{status}</p>
        {role && <span className="role-badge">Tu rol: {role}</span>}
        
        {/* Audio Control */}
        <motion.button
          className="audio-toggle"
          onClick={toggleSound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
        >
          {soundEnabled ? <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </motion.button>
        
        {gameStarted && (
          <motion.div 
            className={`turn-indicator ${yourTurn ? 'your-turn' : 'opponent-turn'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {yourTurn ? '🎯 ¡TU TURNO!' : '⏳ Turno del oponente'}
          </motion.div>
        )}
      </motion.div>


      {placingShips && !shipsSent && (
        <>
          <motion.div 
            className="ship-type-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="selector-title">Selecciona tipo de barco para colocar:</h4>
            <div className="ship-types-grid">
              {SHIP_TYPES.map((shipType) => (
                <motion.button
                  key={shipType.id}
                  className={`ship-type-btn ${selectedShipType?.id === shipType.id ? 'selected' : ''}`}
                  onClick={() => setSelectedShipType(shipType)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderColor: shipType.color }}
                >
                  <span className="ship-emoji">{shipType.emoji}</span>
                  <span className="ship-name">{shipType.name}</span>
                  <span className="ship-size">({shipType.size} casillas)</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="placement-controls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="btn btn-secondary" onClick={handleRandomPlacement}>
              🎲 Colocación Aleatoria
            </button>
            <button className="btn btn-danger" onClick={handleClearBoard}>
              🗑️ Limpiar Tablero
            </button>
            <button className="btn btn-primary" onClick={handleSendShips}>
              ✅ Listo
            </button>
          </motion.div>
        </>
      )}

      <div className="boards-container">
        <Board
          board={ownBoard}
          title="Tu tablero"
          isOwn={true}
          onCellClick={handleCellClick}
          disabled={!placingShips || shipsSent}
          shipCount={ownShipsLeft}
        />
        <Board
          board={enemyBoard}
          title="Tablero enemigo"
          isOwn={false}
          onCellClick={handleEnemyCellClick}
          disabled={!gameStarted || !yourTurn}
          flashCell={flashCell}
          sunkCount={enemyShipsSunk}
        />
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div 
            className="game-over-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="game-over-content"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <h2 className={`game-over-title ${winner === socket.id ? 'victory' : 'defeat'}`}>
                {winner === socket.id ? (
                  <>
                    <GiTrophy style={{ marginRight: 15 }} />
                    ¡VICTORIA!
                    <GiTrophy style={{ marginLeft: 15 }} />
                  </>
                ) : (
                  <>
                    <FaSkull style={{ marginRight: 15 }} />
                    DERROTA
                    <FaSkull style={{ marginLeft: 15 }} />
                  </>
                )}
              </h2>
              <p className="game-over-message">
                {winner === socket.id 
                  ? '¡Felicidades! Hundiste todos los barcos enemigos.' 
                  : 'El oponente hundió todos tus barcos.'}
              </p>
              <div className="game-over-stats">
                <div className="stat-row">
                  <span>Tus barcos restantes:</span>
                  <span>{ownShipsLeft}</span>
                </div>
                <div className="stat-row">
                  <span>Barcos enemigos hundidos:</span>
                  <span>{enemyShipsSunk}</span>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.reload()}
                style={{ marginTop: 20 }}
              >
                🔄 Jugar de Nuevo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
