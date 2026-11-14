"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveHeartProps {
  onComplete: () => void;
}

export default function InteractiveHeart({ onComplete }: InteractiveHeartProps) {
  const [taps, setTaps] = useState(0);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const maxTaps = 7;

  const handleTap = useCallback(() => {
    if (isComplete) return;
    const newTaps = taps + 1;
    setTaps(newTaps);

    const emojis = ["✨", "💖", "⭐", "💫"];
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)));
    }, 1000);

    if (newTaps >= maxTaps) {
      setIsComplete(true);
      setTimeout(() => onComplete(), 1200);
    }
  }, [taps, isComplete, onComplete]);

  const fill = Math.min((taps / maxTaps) * 100, 100);

  return (
    <div className="flex flex-col items-center relative">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, x: s.x, y: s.y - 40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none select-none"
            style={{ left: "50%", top: "50%" }}
          >
            {s.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleTap}
        whileTap={{ scale: 0.82 }}
        animate={{
          scale: isComplete ? [1, 1.15, 1.05] : 1 + taps * 0.05,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
        className="focus:outline-none bg-transparent border-none p-0 touch-manipulation"
        aria-label="Toca el corazón"
      >
        <svg viewBox="0 0 100 100" className="w-48 h-48">
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E4" />
              <stop offset={`${fill}%`} stopColor="#FFE4E4" />
              <stop offset={`${fill}%`} stopColor="#D46A6A" />
              <stop offset="100%" stopColor="#8B3A3A" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 88 C20 65, 5 45, 5 28 C5 14, 15 5, 28 5 C38 5, 46 12, 50 20 C54 12, 62 5, 72 5 C85 5, 95 14, 95 28 C95 45, 80 65, 50 88 Z"
            fill="url(#hg)"
            filter={taps > 2 ? "url(#glow)" : undefined}
          />
        </svg>
      </motion.button>

      <div className="mt-4 flex gap-1.5">
        {[...Array(maxTaps)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i < taps ? 1.2 : 1 }}
            className={`w-2.5 h-2.5 rounded-full ${i < taps ? "bg-[#D46A6A]" : "bg-[#3a2a30]"}`}
          />
        ))}
      </div>

      {taps > 0 && taps < maxTaps && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-white/60">
          {maxTaps - taps} toques más...
        </motion.p>
      )}
    </div>
  );
}
