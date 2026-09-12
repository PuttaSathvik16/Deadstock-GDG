'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface KineticHeadlineProps {
  lines: string[];
  accentLineIndex?: number;
  accentWord?: string;
  className?: string;
}

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  lines,
  accentLineIndex = 3,
  accentWord = 'EXISTS.',
  className = '',
}) => {
  return (
    <div className={`font-display font-black tracking-tighter leading-[0.88] select-none ${className}`}>
      {lines.map((line, idx) => {
        const isAccentLine = idx === accentLineIndex;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: idx * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            {isAccentLine && accentWord && line.includes(accentWord) ? (
              <span>
                {line.replace(accentWord, '')}
                <span className="text-yellow drop-shadow-[0_0_24px_rgba(242,255,85,0.4)] underline decoration-yellow/40 underline-offset-8">
                  {accentWord}
                </span>
              </span>
            ) : (
              <span className="text-bone hover:text-yellow/90 transition-colors">
                {line}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
