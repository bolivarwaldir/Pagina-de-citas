"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveHeartProps {
  onComplete: () => void;
}

export default function InteractiveHeart({ onComplete }: InteractiveHeartProps) {
  const [taps, setTaps] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const maxTaps = 7;

  const handleTap = useCallback(() => {
    if (isComplete) return;

    const newTaps = taps + 1;
    setTaps(newTaps);

    // Add particles
    const newParticles = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);

    if (newTaps >= maxTaps) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }, [taps, isComplete, onComplete]);

  const fillPercentage = Math.min((taps / maxTaps) * 100, 100);
  const scale = 1 + taps * 0.03;
  const brightness = 0.6 + (taps / maxTaps) * 0.4;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 1, x: p.x, y: p.y - 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute text-rose-deep text-lg pointer-events-none"
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Heart SVG */}
        <motion.button
          onClick={handleTap}
          whileTap={{ scale: 0.9 }}
          className="relative focus:outline-none cursor-pointer"
          style={{ scale }}
          aria-label="Toca el corazón"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-lg"
            style={{ filter: `brightness(${brightness})` }}
          >
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8E1E1" />
                <stop offset={`${fillPercentage}%`} stopColor="#F8E1E1" />
                <stop offset={`${fillPercentage}%`} stopColor="#C45C5C" />
                <stop offset="100%" stopColor="#8B3A3A" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 88 C20 65, 5 45, 5 28 C5 14, 15 5, 28 5 C38 5, 46 12, 50 20 C54 12, 62 5, 72 5 C85 5, 95 14, 95 28 C95 45, 80 65, 50 88 Z"
              fill={`url(#heartGradient)`}
              stroke="#C45C5C"
              strokeWidth="1.5"
              filter={isComplete ? "url(#glow)" : undefined}
              className={taps > 0 ? "heart-pulse" : ""}
            />
            {/* Inner highlight */}
            <path
              d="M50 75 C30 58, 18 42, 18 30 C18 20, 25 14, 34 14 C42 14, 48 20, 50 26 C52 20, 58 14, 66 14 C75 14, 82 20, 82 30 C82 42, 70 58, 50 75 Z"
              fill="white"
              opacity={0.15 + (taps / maxTaps) * 0.1}
            />
          </svg>

          {/* Floating small hearts when complete */}
          {isComplete && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -60 - Math.random() * 40,
                    x: (Math.random() - 0.5) * 80,
                  }}
                  transition={{ duration: 1.2, delay: i * 0.1 }}
                  className="absolute text-2xl pointer-events-none"
                  style={{ left: "50%", top: "50%" }}
                >
                  ❤️
                </motion.span>
              ))}
            </>
          )}
        </motion.button>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex gap-1.5">
        {[...Array(maxTaps)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < taps ? "bg-rose-deep scale-110" : "bg-rose-powder/50"
            }`}
          />
        ))}
      </div>

      {taps > 0 && taps < maxTaps && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-rose-wine/70 font-light"
        >
          {maxTaps - taps} toques más...
        </motion.p>
      )}
    </div>
  );
}
