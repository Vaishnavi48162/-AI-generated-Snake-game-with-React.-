import { useState, useRef, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 100;

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'BUTTON') {
         if (e.key === " ") return; 
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === " ") {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.tagName !== 'BUTTON' && activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
        }
        if (gameOver) { resetGame(); return; }
        if (!hasStarted) { setHasStarted(true); return; }
        setIsPaused((p) => !p);
        return;
      }
      if (isPaused || !hasStarted) return;
      const currentDir = directionRef.current;
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") {
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
      } else if (key === "arrowdown" || key === "s") {
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
      } else if (key === "arrowleft" || key === "a") {
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
      } else if (key === "arrowright" || key === "d") {
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  // Main loop
  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const nextHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }
        if (prevSnake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];
        if (nextHead.x === food.x && nextHead.y === food.y) {
          setScore((s) => s + 16); // Hex-ish score increments
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [hasStarted, isPaused, gameOver, food, generateFood]);

  return (
    <div className="flex flex-col w-full max-w-md border-4 border-[#0ff] bg-black p-4 glitch-box shadow-[8px_8px_0_#f0f]">
       
      <div className="flex justify-between items-end font-mono text-xs md:text-sm mb-4 border-b-2 border-dashed border-[#0ff] pb-2 uppercase tracking-tight">
         <span className="text-[#0ff]">&gt; MEM_ALLOC: 0x{score.toString(16).toUpperCase()}</span>
         {gameOver && <span className="text-[#f0f] bg-[#ff0] px-1 glitch-text" data-text="FATAL_ERR">FATAL_ERR</span>}
         {isPaused && !gameOver && <span className="text-black bg-[#0ff] px-1 animate-pulse">SYS_HALT</span>}
      </div>

      <div className="relative w-full aspect-square bg-[#000] border-2 border-[#f0f] overflow-hidden shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]">
        
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Start Overlay */}
        {!hasStarted && !gameOver && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <button
                 onClick={(e) => { e.currentTarget.blur(); setHasStarted(true); }}
                 className="px-4 py-2 border-2 border-[#0ff] text-[#0ff] font-mono text-sm tracking-widest hover:bg-[#0ff] hover:text-black hover:shadow-[0_0_10px_#0ff] transition-all cursor-pointer"
              >
                  [ EXECUTE ]
              </button>
           </div>
        )}

        {/* Restart Overlay */}
        {gameOver && (
           <div className="absolute inset-0 flex items-center justify-center bg-[#f0f]/20 z-20">
              <button
                 onClick={(e) => { e.currentTarget.blur(); resetGame(); }}
                 className="px-4 py-2 border-2 border-[#f0f] bg-black text-[#f0f] font-mono text-sm tracking-widest hover:bg-[#f0f] hover:text-black hover:shadow-[0_0_10px_#f0f] transition-all cursor-pointer"
              >
                  [ REBOOT ]
              </button>
           </div>
        )}

        {/* Food */}
        <div
          className="absolute bg-[#ff0] shadow-[0_0_8px_#ff0]"
          style={{
            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
            left: `${food.x * (100 / GRID_SIZE)}%`, top: `${food.y * (100 / GRID_SIZE)}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className="absolute bg-[#0ff] border border-black shadow-[0_0_5px_#0ff] z-10"
            style={{
              width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
              left: `${segment.x * (100 / GRID_SIZE)}%`, top: `${segment.y * (100 / GRID_SIZE)}%`,
              backgroundColor: i === 0 ? '#fff' : '#0ff'
            }}
          />
        ))}
      </div>

       <div className="mt-4 text-[#f0f] text-[0.6rem] font-mono tracking-widest text-center select-none uppercase">
          &gt; INPUT: [W][A][S][D] / [ARROWS] <br />
          &gt; INTERRUPT: [SPACE]
       </div>
    </div>
  );
}
