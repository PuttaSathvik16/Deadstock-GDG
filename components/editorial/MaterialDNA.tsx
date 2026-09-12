'use client';

import React from 'react';
import { Material } from '@/types';

interface MaterialDNAProps {
  material: Material;
  className?: string;
  compact?: boolean;
}

export const MaterialDNA: React.FC<MaterialDNAProps> = ({
  material,
  className = '',
  compact = false,
}) => {
  const confPct = Math.round((material.confidence || 0.9) * 100);
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confPct / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 p-2 rounded bg-ink-soft/90 border border-white/10 font-mono ${className}`}>
      {/* Color Swatch & Thumbnail */}
      <div className="relative w-8 h-8 rounded-[2px] overflow-hidden shrink-0 border border-white/20">
        {material.provenance?.source_image ? (
          <img
            src={material.provenance.source_image}
            alt={material.label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: material.visual?.swatch_hex || '#333' }}
          />
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: material.visual?.swatch_hex || '#F2FF55' }}
        />
      </div>

      {/* DNA Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px] text-bone/60 leading-none">
          <span className="font-bold text-bone truncate">{material.id}</span>
          <span className="text-yellow">{material.estimate?.quantity_estimate?.value} {material.estimate?.quantity_estimate?.unit}</span>
        </div>
        <div className="text-[11px] font-semibold text-bone truncate mt-0.5">
          {material.label}
        </div>
        {!compact && (
          <div className="text-[9px] text-bone/40 truncate">
            {material.properties?.weight_class_guess?.split('(')[0] || material.category}
          </div>
        )}
      </div>

      {/* Confidence Circular Meter */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="w-8 h-8 -rotate-90">
          <circle
            cx="16"
            cy="16"
            r={radius}
            className="stroke-white/10"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke={confPct > 90 ? '#F2FF55' : '#4D74FF'}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-[8px] font-bold text-bone">
          {confPct}%
        </span>
      </div>
    </div>
  );
};
