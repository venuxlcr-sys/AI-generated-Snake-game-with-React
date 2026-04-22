
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const moveRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food isn't on snake
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    moveRef.current = 'RIGHT';
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') moveRef.current = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') moveRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') moveRef.current = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') moveRef.current = 'RIGHT'; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = moveRef.current;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, isGameOver, gameStarted]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (optional but adds vibe)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const cellSize = canvas.width / GRID_SIZE;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();ctx.moveTo(i * cellSize, 0);ctx.lineTo(i * cellSize, canvas.height);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0, i * cellSize);ctx.lineTo(canvas.width, i * cellSize);ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      
      const padding = 2;
      ctx.fillRect(
        seg.x * cellSize + padding,
        seg.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );

      if (isHead) {
        // Eyes
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        const eyeSize = 2;
        if (direction === 'RIGHT' || direction === 'LEFT') {
            ctx.fillRect(seg.x * cellSize + cellSize/2, seg.y * cellSize + cellSize/4, eyeSize, eyeSize);
            ctx.fillRect(seg.x * cellSize + cellSize/2, seg.y * cellSize + (cellSize*3)/4, eyeSize, eyeSize);
        } else {
            ctx.fillRect(seg.x * cellSize + cellSize/4, seg.y * cellSize + cellSize/2, eyeSize, eyeSize);
            ctx.fillRect(seg.x * cellSize + (cellSize*3)/4, seg.y * cellSize + cellSize/2, eyeSize, eyeSize);
        }
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food, direction]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-between items-center px-4 glass p-4 rounded-xl neon-border">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-orbitron">Score</span>
          <span className="text-2xl font-bold font-orbitron neon-text-blue">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-orbitron">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-neon-yellow" />
            <span className="text-xl font-bold font-orbitron text-neon-yellow">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg neon-border max-w-full touch-none"
          id="snake-canvas"
        />
        
        <AnimatePresence>
          {(!gameStarted || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center glass rounded-lg bg-black/60 backdrop-blur-sm z-10"
            >
              <div className="text-center p-8">
                <h2 className="text-3xl font-orbitron font-black mb-4 tracking-tighter neon-text-pink">
                  {isGameOver ? 'GAME OVER' : 'READY?'}
                </h2>
                <button
                  onClick={resetGame}
                  className="group relative flex items-center gap-3 px-8 py-3 bg-neon-blue text-black font-orbitron font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                  {isGameOver ? <RotateCcw size={20} /> : <Play size={20} />}
                  {isGameOver ? 'RETRY' : 'START GAME'}
                </button>
                <p className="mt-4 text-white/40 text-xs font-medium tracking-wide">
                  USE ARROW KEYS OR SWIPE TO MOVE
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Controls Helper */}
      <div className="grid grid-cols-3 gap-2 lg:hidden">
        <div />
        <button className="glass p-4 rounded-lg active:bg-neon-blue/20" onClick={() => moveRef.current = 'UP'}>↑</button>
        <div />
        <button className="glass p-4 rounded-lg active:bg-neon-blue/20" onClick={() => moveRef.current = 'LEFT'}>←</button>
        <button className="glass p-4 rounded-lg active:bg-neon-blue/20" onClick={() => moveRef.current = 'DOWN'}>↓</button>
        <button className="glass p-4 rounded-lg active:bg-neon-blue/20" onClick={() => moveRef.current = 'RIGHT'}>→</button>
      </div>
    </div>
  );
};
