"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveHeartProps {
  onComplete: () => void;
}

export default function InteractiveHeart({ onComplete }: InteractiveHeartProps) {
  const [taps, setTaps] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const maxTaps = 7;

  const handleTap = useCallback(() => {
    if (isComplete) return;
    const newTaps = taps + 1;
    setTaps(newTaps);

    // Generate sparkles
    const newSparks = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 80,
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 900);

    if (newTaps >= maxTaps) {
      setIsComplete(true);
      setTimeout(() => onComplete(), 1000);
    }
  }, [taps, isComplete, onComplete]);

  const fill = Math.min((taps / maxTaps) * 100, 100);
  const scale = 1 + taps * 0.04;

  return (
    <div className="flex flex-col items-center relative">
      {/* Sparkles */}
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, x: s.x, y: s.y - 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute text-xl pointer-events-none"
            style={{ left: "50%", top: "50%" }}
          >
            ✨
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Heart */}
      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.85 }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="focus:outline-none bg-transparent border-none p-0"
        aria-label="Toca el corazón"
      >
        <svg viewBox="0 0 100 100" className="w-44 h-44">
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8E1E1" />
              <stop offset={`${fill}%`} stopColor="#F8E1E1" />
              <stop offset={`${fill}%`} stopColor="#C45C5C" />
              <stop offset="100%" stopColor="#8B3A3A" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 88 C20 65, 5 45, 5 28 C5 14, 15 5, 28 5 C38 5, 46 12, 50 20 C54 12, 62 5, 72 5 C85 5, 95 14, 95 28 C95 45, 80 65, 50 88 Z"
            fill="url(#hg)"
            filter={isComplete ? "url(#softGlow)" : undefined}
          />
        </svg>
      </motion.button>

      {/* Progress dots */}
      <div className="mt-4 flex gap-1.5">
        {[...Array(maxTaps)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < taps ? "bg-[#C45C5C] scale-110" : "bg-[#3a2a30]"
            }`}
          />
        ))}
      </div>

      {taps > 0 && taps < maxTaps && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-white/60"
        >
          {maxTaps - taps} toques más...
        </motion.p>
      )}
    </div>
  );
}
