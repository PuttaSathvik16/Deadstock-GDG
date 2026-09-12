'use client';

import React from 'react';
import { Lock } from 'lucide-react';

interface ConstraintBadgeProps {
  label: string;
  variant?: 'locked' | 'active' | 'warning' | 'neutral';
  showLock?: boolean;
  showBarcode?: boolean;
  className?: string;
}

export const ConstraintBadge: React.FC<ConstraintBadgeProps> = ({
  label,
  variant = 'locked',
  showLock = true,
  showBarcode = true,
  className = '',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'locked':
        return 'border-yellow/50 bg-yellow/10 text-yellow';
      case 'warning':
        return 'border-terracotta/60 bg-terracotta/15 text-terracotta';
      case 'active':
        return 'border-cobalt-electric/50 bg-cobalt-electric/15 text-cobalt-lavender';
      default:
        return 'border-white/10 bg-white/5 text-bone/70';
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] border font-mono text-[11px] font-semibold tracking-wider uppercase corner-notch ${getStyles()} ${className}`}
    >
      {showLock && <Lock className="w-2.5 h-2.5 shrink-0" />}
      <span>{label}</span>
      {showBarcode && (
        <span className="w-4 h-2.5 technical-barcode opacity-60 ml-0.5 shrink-0" />
      )}
    </div>
  );
};
