'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Subtle magnetic attraction (Section 22: max 12-18px displacement)
    setPosition({
      x: distanceX * 0.22,
      y: distanceY * 0.22,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-yellow text-ink hover:bg-yellow/90 shadow-[0_0_20px_rgba(242,255,85,0.3)] border-transparent font-bold';
      case 'secondary':
        return 'bg-white/5 text-white hover:bg-white/10 border-white/15';
      case 'accent':
        return 'bg-royal text-white hover:bg-royal/90 border-royal shadow-[0_0_20px_rgba(38,60,255,0.4)] font-bold';
      case 'ghost':
        return 'bg-transparent text-white/70 hover:text-white border-transparent';
      default:
        return 'bg-yellow text-ink';
    }
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
      className={`relative px-5 py-3 rounded-sm font-mono text-xs uppercase tracking-wider transition-colors border disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
