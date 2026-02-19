import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from '@/animations/gsap.config';
import { prefersReducedMotion } from '@/utils/helpers';
import basketImg from '@/assets/basket.png';
import fryImg from '@/assets/fry.png';
import chilliImg from '@/assets/chilli.png';

interface CatchTheFriesGameProps {
  onGameEnd: (friesCaught: number) => void;
  onClose: () => void;
}

interface Fry {
  id: string;
  x: number;
  y: number;
  speed: number;
  type: 'normal' | 'chilli';
  element: HTMLDivElement | null;
}

interface Feedback {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'catch' | 'miss' | 'chilli';
  element: HTMLDivElement | null;
}

const GAME_DURATION = 15; // seconds
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 60;
const BASKET_WIDTH_MOBILE = 70;
const BASKET_HEIGHT_MOBILE = 50;
const FRY_WIDTH = 40;
const FRY_HEIGHT = 50;
const FRY_WIDTH_MOBILE = 35;
const FRY_HEIGHT_MOBILE = 45;
const CHILLI_WIDTH = 35;
const CHILLI_HEIGHT = 45;
const CHILLI_WIDTH_MOBILE = 30;
const CHILLI_HEIGHT_MOBILE = 40;
const GAME_WIDTH_DESKTOP = 600;
const GAME_HEIGHT_DESKTOP = 400;
const GAME_WIDTH_TABLET = 500;
const GAME_HEIGHT_TABLET = 350;
const CHILLI_CHANCE = 0.15; // 15% chance for chilli
const MAX_CHILLIS = 3;

const CatchTheFriesGame = ({ onGameEnd, onClose }: CatchTheFriesGameProps) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'playing' | 'finished'>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0); // Use ref to avoid dependency issues
  const [chillisCaught, setChillisCaught] = useState(0);
  const [showFryRush, setShowFryRush] = useState(false);
  const friesRef = useRef<Fry[]>([]);
  const feedbacksRef = useRef<Feedback[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const [gameDimensions, setGameDimensions] = useState({ width: GAME_WIDTH_DESKTOP, height: GAME_HEIGHT_DESKTOP });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const basketXRef = useRef<number>(GAME_WIDTH_DESKTOP / 2 - BASKET_WIDTH / 2);
  const lastSpawnTimeRef = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);
  const reducedMotion = prefersReducedMotion();

  // Sync score ref with state
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Calculate responsive game dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 640; // sm breakpoint
      const isTabletDevice = width >= 640 && width < 1024; // md breakpoint
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      
      let gameWidth: number;
      let gameHeight: number;
      
      if (isMobileDevice) {
        // Mobile: use viewport width minus padding
        gameWidth = Math.min(350, width - 32);
        gameHeight = Math.min(280, (width - 32) * 0.8);
      } else if (isTabletDevice) {
        // Tablet: fixed medium size
        gameWidth = GAME_WIDTH_TABLET;
        gameHeight = GAME_HEIGHT_TABLET;
      } else {
        // Desktop: full size
        gameWidth = GAME_WIDTH_DESKTOP;
        gameHeight = GAME_HEIGHT_DESKTOP;
      }
      
      setGameDimensions({ width: gameWidth, height: gameHeight });
      const basketW = isMobileDevice ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
      basketXRef.current = gameWidth / 2 - basketW / 2;
      if (basketRef.current) {
        gsap.set(basketRef.current, { x: basketXRef.current });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Generate unique ID
  const idCounter = useRef(0);
  const getNextId = () => `item-${++idCounter.current}`;

  // Handle basket movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (gameState !== 'playing' || !gameContainerRef.current) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
    const newX = Math.max(0, Math.min(gameDimensions.width - basketW, mouseX - basketW / 2));
    basketXRef.current = newX;
    
    if (basketRef.current) {
      gsap.to(basketRef.current, {
        x: newX,
        duration: reducedMotion ? 0 : 0.1,
        ease: 'power2.out',
      });
    }
  }, [gameState, gameDimensions.width, reducedMotion, isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (gameState !== 'playing' || !gameContainerRef.current) return;
    e.preventDefault();
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
    const newX = Math.max(0, Math.min(gameDimensions.width - basketW, touchX - basketW / 2));
    basketXRef.current = newX;
    
    if (basketRef.current) {
      gsap.to(basketRef.current, {
        x: newX,
        duration: reducedMotion ? 0 : 0.1,
        ease: 'power2.out',
      });
    }
  }, [gameState, gameDimensions.width, reducedMotion, isMobile]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const moveSpeed = isMobile ? 8 : 10;
    const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
    if (e.key === 'ArrowLeft') {
      basketXRef.current = Math.max(0, basketXRef.current - moveSpeed);
    } else if (e.key === 'ArrowRight') {
      basketXRef.current = Math.min(gameDimensions.width - basketW, basketXRef.current + moveSpeed);
    }
    
    if (basketRef.current) {
      gsap.to(basketRef.current, {
        x: basketXRef.current,
        duration: reducedMotion ? 0 : 0.1,
        ease: 'power2.out',
      });
    }
  }, [gameState, gameDimensions.width, reducedMotion, isMobile]);

  // Create feedback text
  const createFeedback = (x: number, y: number, text: string, type: 'catch' | 'miss' | 'chilli') => {
    const feedback: Feedback = {
      id: getNextId(),
      x,
      y,
      text,
      type,
      element: null,
    };

    const feedbackElement = document.createElement('div');
    feedbackElement.id = feedback.id;
    feedbackElement.className = `absolute pointer-events-none z-20 font-bold text-lg ${
      type === 'catch' ? 'text-green-500' : type === 'chilli' ? 'text-red-500' : 'text-gray-400'
    }`;
    feedbackElement.style.left = `${x}px`;
    feedbackElement.style.top = `${y}px`;
    feedbackElement.textContent = text;
    feedbackElement.style.willChange = 'transform, opacity';
    
    if (gameContainerRef.current) {
      gameContainerRef.current.appendChild(feedbackElement);
      feedback.element = feedbackElement;
      feedbacksRef.current.push(feedback);

      // Animate feedback
      if (!reducedMotion) {
        gsap.fromTo(
          feedbackElement,
          { y: y, opacity: 1, scale: 0.5 },
          {
            y: y - 50,
            opacity: 0,
            scale: 1.2,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              if (feedbackElement.parentNode) {
                feedbackElement.parentNode.removeChild(feedbackElement);
              }
              feedbacksRef.current = feedbacksRef.current.filter(f => f.id !== feedback.id);
            },
          }
        );
      } else {
        setTimeout(() => {
          if (feedbackElement.parentNode) {
            feedbackElement.parentNode.removeChild(feedbackElement);
          }
          feedbacksRef.current = feedbacksRef.current.filter(f => f.id !== feedback.id);
        }, 800);
      }
    }
  };

  // Create sparkle burst
  const createSparkle = (x: number, y: number) => {
    if (reducedMotion) return;
    
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none z-20';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      
      if (gameContainerRef.current) {
        gameContainerRef.current.appendChild(sparkle);
        const angle = (i / 6) * Math.PI * 2;
        const distance = 20;
        
        gsap.to(sparkle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            if (sparkle.parentNode) {
              sparkle.parentNode.removeChild(sparkle);
            }
          },
        });
      }
    }
  };

  // Basket shake animation
  const shakeBasket = () => {
    if (!basketRef.current || reducedMotion) return;
    
    gsap.to(basketRef.current, {
      x: basketXRef.current - 5,
      duration: 0.05,
      yoyo: true,
      repeat: 5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (basketRef.current) {
          gsap.set(basketRef.current, { x: basketXRef.current });
        }
      },
    });
  };

  // Spawn a new fry
  const spawnFry = useCallback((elapsed: number) => {
    const existingChillis = friesRef.current.filter(f => f.type === 'chilli').length;
    const isChilli = existingChillis < MAX_CHILLIS && Math.random() < CHILLI_CHANCE;
    
    // Difficulty ramp
    let baseSpeed = 2;
    let spawnRate = 0.6;
    
    if (elapsed < 5) {
      // First 5s: easy
      baseSpeed = isMobile ? 1.2 : 1.5;
      spawnRate = 0.8;
    } else if (elapsed < 10) {
      // Middle 10s: normal
      baseSpeed = isMobile ? 1.8 : 2;
      spawnRate = 0.6;
    } else {
      // Last 5s: fast (Fry Rush!)
      baseSpeed = isMobile ? 2.2 : 2.5;
      spawnRate = 0.4;
    }
    
    const fryW = isChilli ? (isMobile ? CHILLI_WIDTH_MOBILE : CHILLI_WIDTH) : (isMobile ? FRY_WIDTH_MOBILE : FRY_WIDTH);
    const fryH = isChilli ? (isMobile ? CHILLI_HEIGHT_MOBILE : CHILLI_HEIGHT) : (isMobile ? FRY_HEIGHT_MOBILE : FRY_HEIGHT);
    
    const fry: Fry = {
      id: getNextId(),
      x: Math.random() * (gameDimensions.width - fryW),
      y: -fryH,
      speed: baseSpeed + Math.random() * 1,
      type: isChilli ? 'chilli' : 'normal',
      element: null,
    };

    const fryElement = document.createElement('div');
    fryElement.id = fry.id;
    fryElement.className = 'absolute pointer-events-none';
    fryElement.style.width = `${fryW}px`;
    fryElement.style.height = `${fryH}px`;
    fryElement.style.left = `${fry.x}px`;
    fryElement.style.top = `${fry.y}px`;
    fryElement.style.willChange = 'transform';
    fryElement.style.backgroundImage = `url(${isChilli ? chilliImg : fryImg})`;
    fryElement.style.backgroundSize = 'contain';
    fryElement.style.backgroundRepeat = 'no-repeat';
    fryElement.style.backgroundPosition = 'center';
    
    if (gameContainerRef.current) {
      gameContainerRef.current.appendChild(fryElement);
      fry.element = fryElement;
      friesRef.current.push(fry);
    }
  }, [gameDimensions.width, isMobile]);

  // Check collision
  const checkCollision = useCallback((fry: Fry): boolean => {
    const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
    const basketH = isMobile ? BASKET_HEIGHT_MOBILE : BASKET_HEIGHT;
    const basketLeft = basketXRef.current;
    const basketRight = basketLeft + basketW;
    const basketTop = gameDimensions.height - basketH - 20;
    const basketBottom = basketTop + basketH;

    const fryWidth = fry.type === 'chilli' 
      ? (isMobile ? CHILLI_WIDTH_MOBILE : CHILLI_WIDTH)
      : (isMobile ? FRY_WIDTH_MOBILE : FRY_WIDTH);
    const fryHeight = fry.type === 'chilli'
      ? (isMobile ? CHILLI_HEIGHT_MOBILE : CHILLI_HEIGHT)
      : (isMobile ? FRY_HEIGHT_MOBILE : FRY_HEIGHT);
    const fryLeft = fry.x;
    const fryRight = fry.x + fryWidth;
    const fryTop = fry.y;
    const fryBottom = fry.y + fryHeight;

    return !(
      fryRight < basketLeft ||
      fryLeft > basketRight ||
      fryBottom < basketTop ||
      fryTop > basketBottom
    );
  }, [gameDimensions.height, isMobile]);

  // Countdown effect with animation
  useEffect(() => {
    if (gameState === 'countdown' && countdownRef.current) {
      if (!reducedMotion) {
        gsap.fromTo(
          countdownRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.7)',
          }
        );
        gsap.to(countdownRef.current, {
          scale: 1.2,
          opacity: 0,
          duration: 0.2,
          delay: 0.7,
          ease: 'power2.in',
        });
      }
    }
  }, [gameState, countdown, reducedMotion]);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setTimeout(() => {
        setGameState('playing');
      }, 500);
    }
  }, [gameState, countdown]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = (currentTime: number) => {
      // Update timer
      const elapsed = (currentTime - gameStartTimeRef.current) / 1000;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(Math.ceil(remaining));

      // Show Fry Rush! only if score > 10 and in last 5 seconds
      if (remaining <= 5 && scoreRef.current > 10 && !showFryRush) {
        setShowFryRush(true);
      }

      if (remaining <= 0) {
        // Game over - freeze
        setGameState('finished');
        onGameEnd(scoreRef.current);
        return;
      }

      // Spawn fries with difficulty ramp
      const spawnRate = elapsed < 5 ? 0.8 : elapsed < 10 ? 0.6 : 0.4;
      if (currentTime - lastSpawnTimeRef.current > spawnRate * 1000) {
        spawnFry(elapsed);
        lastSpawnTimeRef.current = currentTime;
      }

      // Update fry positions and check collisions
      friesRef.current = friesRef.current.filter((fry) => {
        if (!fry.element) return false;

        fry.y += fry.speed;

        // Check if caught
        const basketH = isMobile ? BASKET_HEIGHT_MOBILE : BASKET_HEIGHT;
        const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
        const fryW = fry.type === 'chilli' 
          ? (isMobile ? CHILLI_WIDTH_MOBILE : CHILLI_WIDTH)
          : (isMobile ? FRY_WIDTH_MOBILE : FRY_WIDTH);
        
        if (fry.y > gameDimensions.height - basketH - 30 && checkCollision(fry)) {
          const fryCenterX = fry.x + fryW / 2;
          const basketCenterX = basketXRef.current + basketW / 2;
          
          if (fry.type === 'chilli') {
            setChillisCaught((prev) => prev + 1);
            const newScore = Math.max(0, scoreRef.current - 2);
            scoreRef.current = newScore;
            setScore(newScore);
            createFeedback(basketCenterX, gameDimensions.height - BASKET_HEIGHT - 40, '-2', 'chilli');
            shakeBasket();
          } else {
            const newScore = scoreRef.current + 1;
            scoreRef.current = newScore;
            setScore(newScore);
            createFeedback(basketCenterX, gameDimensions.height - BASKET_HEIGHT - 40, '+1', 'catch');
            createSparkle(basketCenterX, gameDimensions.height - BASKET_HEIGHT - 30);
          }
          
          // Remove fry
          if (!reducedMotion && fry.element) {
            gsap.to(fry.element, {
              scale: 1.5,
              opacity: 0,
              duration: 0.2,
              ease: 'power2.out',
              onComplete: () => {
                if (fry.element && fry.element.parentNode) {
                  fry.element.parentNode.removeChild(fry.element);
                }
              },
            });
          } else {
            if (fry.element && fry.element.parentNode) {
              fry.element.parentNode.removeChild(fry.element);
            }
          }
          return false;
        }

        // Check if missed (reached bottom)
        if (fry.y > gameDimensions.height) {
          if (fry.type === 'normal') {
            const fryCenterX = fry.x + FRY_WIDTH / 2;
            createFeedback(fryCenterX, gameDimensions.height - 20, 'miss', 'miss');
          }
          
          // Fade out
          if (!reducedMotion && fry.element) {
            gsap.to(fry.element, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                if (fry.element && fry.element.parentNode) {
                  fry.element.parentNode.removeChild(fry.element);
                }
              },
            });
          } else {
            if (fry.element && fry.element.parentNode) {
              fry.element.parentNode.removeChild(fry.element);
            }
          }
          return false;
        }

        // Update position
        if (fry.element) {
          gsap.set(fry.element, {
            y: fry.y,
            force3D: true,
          });
        }

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameStartTimeRef.current = performance.now();
    lastSpawnTimeRef.current = gameStartTimeRef.current;
    animationFrameRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [gameState, checkCollision, spawnFry, onGameEnd, reducedMotion, gameDimensions, showFryRush, isMobile]);

  // Set up event listeners
  useEffect(() => {
    if (gameState === 'playing') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleMouseMove, handleTouchMove, handleKeyDown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      friesRef.current.forEach((fry) => {
        if (fry.element && fry.element.parentNode) {
          fry.element.parentNode.removeChild(fry.element);
        }
      });
      feedbacksRef.current.forEach((feedback) => {
        if (feedback.element && feedback.element.parentNode) {
          feedback.element.parentNode.removeChild(feedback.element);
        }
      });
      friesRef.current = [];
      feedbacksRef.current = [];
    };
  }, []);

  const handleStart = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    scoreRef.current = 0;
    setChillisCaught(0);
    setTimeLeft(GAME_DURATION);
    setShowFryRush(false);
    friesRef.current = [];
    feedbacksRef.current = [];
    const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
    basketXRef.current = gameDimensions.width / 2 - basketW / 2;
    
    if (basketRef.current) {
      gsap.set(basketRef.current, { x: basketXRef.current });
    }
  };

  const finalScore = Math.max(0, score);

  const basketW = isMobile ? BASKET_WIDTH_MOBILE : BASKET_WIDTH;
  const basketH = isMobile ? BASKET_HEIGHT_MOBILE : BASKET_HEIGHT;

  return (
    <div className="w-full">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            Score: <span className="text-primary-600 dark:text-primary-400">{finalScore}</span>
          </div>
          <div className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            Time: <span className="text-primary-600 dark:text-primary-400">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Fry Rush! Label */}
      {showFryRush && gameState === 'playing' && (
        <div className="text-center mb-2">
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-500 text-white rounded-full font-bold text-sm sm:text-lg animate-pulse">
            🍟 Fry Rush! 🍟
          </div>
        </div>
      )}

      {/* Game Area */}
      <div
        ref={gameContainerRef}
        className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-300 dark:border-gray-700 overflow-hidden mx-auto"
        style={{
          width: `${gameDimensions.width}px`,
          height: `${gameDimensions.height}px`,
          maxWidth: '100%',
          maxHeight: '70vh',
        }}
      >
        {/* Waiting State */}
        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 dark:bg-black/40 z-10 px-4">
            <p className="text-base sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-center">
              Move your basket to catch the fries!
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center">
              Use mouse, touch, or arrow keys
            </p>
            <button
              onClick={handleStart}
              className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Finished State - Freeze overlay */}
        {gameState === 'finished' && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10 pointer-events-none" />
        )}

        {/* Countdown */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/50 z-10">
            <div
              ref={countdownRef}
              className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-white"
              style={{
                textShadow: '0 0 20px rgba(249, 115, 22, 0.8)',
              }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </div>
          </div>
        )}

        {/* Basket */}
        <div
          ref={basketRef}
          className="absolute bottom-4 sm:bottom-5 pointer-events-none"
          style={{
            width: `${basketW}px`,
            height: `${basketH}px`,
            willChange: 'transform',
            backgroundImage: `url(${basketImg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
          <p>Catch the fries! Avoid chillis (they reduce your score by 2).</p>
        </div>
      )}
    </div>
  );
};

export default CatchTheFriesGame;
