'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'inspect' | 'trace' | 'join' | 'locked'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.2 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]');
      if (cursorEl) {
        const val = cursorEl.getAttribute('data-cursor') || '';
        if (val === 'inspect') {
          setCursorType('inspect');
          setCursorText('INSPECT');
          return;
        }
        if (val === 'trace') {
          setCursorType('trace');
          setCursorText('TRACE');
          return;
        }
        if (val === 'join') {
          setCursorType('join');
          setCursorText('JOIN');
          return;
        }
        if (val === 'locked') {
          setCursorType('locked');
          setCursorText('LOCKED');
          return;
        }
      }

      const clickable = target.closest('button, a, [role="button"], input, select');
      if (clickable) {
        setCursorType('pointer');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  const isSpecial = ['inspect', 'trace', 'join', 'locked'].includes(cursorType);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          width: isSpecial ? 54 : cursorType === 'pointer' ? 28 : 12,
          height: isSpecial ? 54 : cursorType === 'pointer' ? 28 : 12,
          backgroundColor: isSpecial
            ? 'rgba(242, 255, 85, 0.95)'
            : cursorType === 'pointer'
            ? 'rgba(77, 116, 255, 0.4)'
            : 'rgba(247, 247, 238, 0.8)',
          borderColor: isSpecial ? '#080A18' : 'rgba(255, 255, 255, 0.6)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="rounded-full flex items-center justify-center border text-center transition-colors"
      >
        {isSpecial && (
          <span className="text-[9px] font-mono font-black text-ink tracking-tighter uppercase px-1 select-none">
            {cursorText}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
