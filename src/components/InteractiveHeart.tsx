"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveHeartProps {
  onComplete: () => void;
}

export default function InteractiveHeart({ onComplete }: InteractiveHeartProps) {
  const [taps, setTaps] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const maxTaps = 7;

  const handleTap = useCallback(() => {
    if (isComplete) return;
    const newTaps = taps + 1;
    setTaps(newTaps);
    if (newTaps >= maxTaps) {
      setIsComplete(true);
      setTimeout(() => onComplete(), 800);
    }
  }, [taps, isComplete, onComplete]);

  const fill = Math.min((taps / maxTaps) * 100, 100);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleTap}
        className="focus:outline-none bg-transparent border-none p-0"
        aria-label="Toca el corazón"
      >
        <svg viewBox="0 0 100 100" className="w-40 h-40" style={{ background: "transparent" }}>
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8E1E1" />
              <stop offset={`${fill}%`} stopColor="#F8E1E1" />
              <stop offset={`${fill}%`} stopColor="#C45C5C" />
              <stop offset="100%" stopColor="#8B3A3A" />
            </linearGradient>
          </defs>
          <path
            d="M50 88 C20 65, 5 45, 5 28 C5 14, 15 5, 28 5 C38 5, 46 12, 50 20 C54 12, 62 5, 72 5 C85 5, 95 14, 95 28 C95 45, 80 65, 50 88 Z"
            fill="url(#hg)"
          />
        </svg>
      </button>
      <div className="mt-3 flex gap-1.5">
        {[...Array(maxTaps)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < taps ? "bg-[#C45C5C]" : "bg-[#3a2a30]"}`} />
        ))}
      </div>
      {taps > 0 && taps < maxTaps && (
        <p className="mt-2 text-sm text-white/70">{maxTaps - taps} toques más...</p>
      )}
    </div>
  );
}
