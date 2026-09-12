'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Scissors,
  ArrowRight,
  ShieldAlert,
  Info,
  ChevronRight,
  Eye,
  Check,
  Zap,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Concept, Material, Constraint, GeminiTokenCost } from '@/types';
import { TraceLineOverlay } from '../editorial/TraceLineOverlay';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface ConceptsScreenProps {
  concepts: Concept[];
  materials: Material[];
  constraints: Constraint[];
  onRegenerateAll: () => void;
  onRegenerateLook: (lookId: string) => void;
  onApproveConcept: (lookId: string) => void;
  onNavigateToStudio: () => void;
  onNavigateToSheet: () => void;
  isGenerating: boolean;
  tokenCost?: GeminiTokenCost | null;
}

export const ConceptsScreen: React.FC<ConceptsScreenProps> = ({
  concepts,
  materials,
  constraints,
  onRegenerateAll,
  onRegenerateLook,
  onApproveConcept,
  onNavigateToStudio,
  onNavigateToSheet,
  isGenerating,
  tokenCost,
}) => {
  const [activeZoneHover, setActiveZoneHover] = useState<{
    lookId: string;
    materialId: string;
  } | null>(null);
  const [selectedLookId, setSelectedLookId] = useState<string>(concepts[0]?.id || '');

  const invalidConcepts = concepts.filter((c) => c.affected || c.feasibility === 'invalid');
  const materialsMap = new Map(materials.map((m) => [m.id, m]));

  // Section 13 Progress Rail steps
  const progressSteps = [
    { num: '01', title: 'UNDERSTAND', desc: 'Read Remnant Geometry' },
    { num: '02', title: 'CONSTRAIN', desc: 'Lock Zero-Virgin Stock' },
    { num: '03', title: 'COMPOSE', desc: 'Nest 2D Pattern Zones' },
    { num: '04', title: 'VERIFY', desc: 'Yardage Feasibility Check' },
    { num: '05', title: 'REVEAL', desc: 'Editorial Plate Synthesis' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title & Controller (Section 13: MAKE SOMETHING REAL.) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>05 // CAPSULE GENERATION REEL</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">CONSTRAINED INTELLIGENCE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-1">
            MAKE SOMETHING REAL.
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-1 max-w-2xl">
            The co-designer does not dream up new fibers. Every panel, collar, facing, and hem is cut from observed atelier yardage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerateAll}
            disabled={isGenerating}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-yellow ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate All'}</span>
          </button>

          <button
            onClick={onNavigateToStudio}
            className="px-5 py-2.5 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm shadow-[0_0_20px_rgba(242,255,85,0.3)] transition-all"
          >
            <span>Live Studio War Room</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Token Cost & Rate Limiting Auditor Banner */}
      {tokenCost && (
        <div className="corner-notch px-4 py-3 bg-night/90 border border-yellow/40 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-yellow font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-yellow animate-pulse" />
              <span>{tokenCost.model.toUpperCase()}</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="text-white/80">
              <span className="text-white font-bold">{tokenCost.totalTokens}</span> Tokens{' '}
              <span className="text-white/40 text-[10px]">
                ({tokenCost.promptTokens} in / {tokenCost.candidateTokens} out)
              </span>
            </div>
            <span className="text-white/20">•</span>
            <div className="text-white/80">
              Cost: <span className="text-yellow font-bold">{tokenCost.formattedCost}</span>
            </div>
            <span className="text-white/20">•</span>
            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-lime text-[11px]">
              {tokenCost.savings}
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/50 text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
            <span>SLIDING-WINDOW RATE LIMITER ACTIVE</span>
          </div>
        </div>
      )}

      {/* Generation Progress Rail (Section 13) */}
      <div className="corner-notch p-4 sm:p-5 bg-deep/30 border border-white/10 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-4 font-mono text-xs">
          {progressSteps.map((step, idx) => (
            <div key={step.num} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-yellow/10 border border-yellow/40 text-yellow flex items-center justify-center font-bold text-[11px]">
                  {step.num}
                </span>
                <div>
                  <span className="text-white font-bold block text-[11px] uppercase tracking-wider">
                    {step.title}
                  </span>
                  <span className="text-white/40 text-[9px] block">{step.desc}</span>
                </div>
              </div>
              {idx < progressSteps.length - 1 && (
                <div className="flex-1 h-px bg-white/10 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Generating State Overlay (Section 13) */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="corner-notch p-6 bg-deep border border-yellow/60 text-white font-mono text-xs space-y-3 shadow-2xl"
        >
          <div className="flex items-center gap-2 text-yellow font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>GEMINI COMPUTATIONAL GENERATION PIPELINE (SECTION 13)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="p-2 bg-night border border-white/10 text-yellow animate-pulse">
              1. MAPPING MATERIALS
            </div>
            <div className="p-2 bg-night border border-white/10 text-white/70">
              2. CHECKING STOCK
            </div>
            <div className="p-2 bg-night border border-white/10 text-white/70">
              3. ALLOCATING PANELS
            </div>
            <div className="p-2 bg-night border border-white/10 text-white/70">
              4. VERIFYING TRACE
            </div>
          </div>
        </motion.div>
      )}

      {/* Causal Conflict Alert Banner (Sections 16 & 17) */}
      {invalidConcepts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="corner-notch p-6 sm:p-8 bg-terracotta/10 border-2 border-terracotta text-white space-y-4 shadow-[0_0_30px_rgba(255,107,107,0.2)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-terracotta font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <span>CAUSAL CONFLICT DETECTED • SECTION 17 REAL-TIME REPAIR</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                {invalidConcepts.map((c) => c.title).join(' & ')} requires zone substitution.
              </h3>
              <p className="text-xs text-paper/80 font-mono max-w-2xl leading-relaxed">
                {invalidConcepts[0]?.change_reason ||
                  'The lantern sleeves depended on Burgundy Satin (MAT-004), which was quarantined. Click below to repair this look using verified Mulberry Raw Silk (MAT-002).'}
              </p>
            </div>

            <button
              onClick={() => onRegenerateLook(invalidConcepts[0]?.id)}
              disabled={isGenerating}
              className="px-6 py-3 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-[0_0_20px_rgba(242,255,85,0.3)] transition-all shrink-0"
            >
              <Scissors className="w-4 h-4" />
              <span>Repair Affected Zones Only</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Editorial Fashion Plates Reel (Section 14) */}
      <div className="space-y-12">
        {concepts.map((concept, idx) => {
          const isInvalid = concept.affected || concept.feasibility === 'invalid';
          const isSelected = selectedLookId === concept.id;

          return (
            <motion.div
              key={concept.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`corner-notch border transition-all overflow-hidden bg-night/90 ${
                isInvalid
                  ? 'border-terracotta shadow-[0_0_30px_rgba(255,107,107,0.25)]'
                  : 'border-white/15 hover:border-yellow/50'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left: Large Editorial Garment Image Plate (col-span-5) */}
                <div className="lg:col-span-5 relative bg-deep min-h-[440px] overflow-hidden group">
                  <img
                    src={concept.visual_uri}
                    alt={concept.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                      isInvalid ? 'grayscale opacity-75' : ''
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40 pointer-events-none" />

                  {/* Look Identification Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-3 py-1 bg-night/90 border border-white/20 text-white">
                      LOOK 0{concept.look_number}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    {isInvalid ? (
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-terracotta text-white uppercase tracking-wider">
                        CONSTRAINT CONFLICT
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-yellow text-ink uppercase tracking-wider">
                        CONSTRAINT PASS
                      </span>
                    )}
                  </div>

                  {/* Trace Line Overlay Component (Section 42) */}
                  <TraceLineOverlay
                    active={Boolean(activeZoneHover && activeZoneHover.lookId === concept.id)}
                    sourceLabel="GARMENT PANEL"
                    targetLabel={activeZoneHover?.materialId || 'MAT-001'}
                    variant={isInvalid ? 'alert' : 'active'}
                  />

                  {/* Silhouette Tag */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-[10px] text-yellow uppercase tracking-widest block">
                      {concept.silhouette}
                    </span>
                    <h3 className="font-display text-2xl font-black text-white uppercase mt-0.5">
                      {concept.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Engineering Spec & Material Traceability Breakdown (col-span-7) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    {/* Header Spec Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 uppercase">CONFIDENCE:</span>
                        <span className="text-yellow font-bold">HIGH (96% FEASIBLE)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 uppercase">STATUS:</span>
                        <span className={isInvalid ? 'text-terracotta font-bold' : 'text-yellow font-bold'}>
                          {isInvalid ? 'REPAIR REQUIRED' : 'FEASIBLE & VERIFIED'}
                        </span>
                      </div>
                    </div>

                    {/* Section 14 & 15: Conflict Banner or Causal Trace Resolution */}
                    {isInvalid ? (
                      <div className="corner-notch p-4 bg-terracotta/20 border-2 border-terracotta space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-terracotta font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            MATERIAL CONFLICT DETECTED
                          </span>
                          <span>STATUS: INVALID</span>
                        </div>
                        <p className="text-white/90 text-xs">
                          This design requires <strong>MAT-004 Burgundy Satin</strong>. Available in atelier: <strong>0m</strong>.
                        </p>
                        <button
                          onClick={() => onRegenerateLook(concept.id)}
                          disabled={isGenerating}
                          className="mt-2 px-4 py-2 bg-yellow hover:bg-yellow/90 text-ink font-bold uppercase tracking-wider flex items-center gap-2 rounded-sm shadow"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>[ REGENERATE LOOK ]</span>
                        </button>
                      </div>
                    ) : concept.change_reason ? (
                      <div className="corner-notch p-4 bg-yellow/10 border border-yellow/40 space-y-2 font-mono text-xs">
                        <div className="text-yellow font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>SIGNATURE TRACE UPDATE (SECTION 16)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 bg-night border border-terracotta/40 text-terracotta line-through">
                            OLD: Sleeve → MAT-004 ❌
                          </div>
                          <div className="p-2 bg-night border border-yellow/50 text-yellow font-bold">
                            NEW: Sleeve → MAT-002 ✓
                          </div>
                        </div>
                        <div className="text-[10px] text-white/60">
                          {concept.change_reason}
                        </div>
                      </div>
                    ) : null}

                    {/* Editorial Concept Description */}
                    <p className="font-mono text-xs sm:text-sm text-paper/80 leading-relaxed">
                      {concept.description}
                    </p>

                    {/* Signature Material Trace Interaction (Section 14 & 42) */}
                    <div className="space-y-3">
                      <div className="font-mono text-[11px] text-yellow uppercase font-bold tracking-wider flex items-center justify-between">
                        <span>MATERIAL PROVENANCE TRACE (HOVER TO ILLUMINATE PATH)</span>
                        <span className="text-white/40 text-[9px]">ZERO VIRGIN ALLOCATION</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {concept.uses.map((matId) => {
                          const mat = materialsMap.get(matId);
                          const isHovered =
                            activeZoneHover?.lookId === concept.id &&
                            activeZoneHover?.materialId === matId;

                          return (
                            <div
                              key={matId}
                              onMouseEnter={() => setActiveZoneHover({ lookId: concept.id, materialId: matId })}
                              onMouseLeave={() => setActiveZoneHover(null)}
                              className={`corner-notch p-3 border transition-all cursor-pointer ${
                                isHovered
                                  ? 'border-yellow bg-yellow/10 scale-105 shadow-[0_0_15px_rgba(242,255,85,0.3)]'
                                  : 'border-white/10 bg-deep/20 hover:border-white/30'
                              } ${!mat?.approved ? 'border-terracotta/50 bg-terracotta/10' : ''}`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="font-bold text-yellow">{matId}</span>
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-white/30"
                                  style={{ backgroundColor: mat?.visual.swatch_hex || '#444' }}
                                />
                              </div>
                              <div className="text-xs font-semibold text-white truncate mt-1">
                                {mat?.label || matId}
                              </div>
                              <div className="text-[10px] font-mono text-white/50 truncate mt-0.5">
                                Alloc: ~{mat ? (Number(mat.estimate.quantity_estimate.value) * 0.4).toFixed(1) : '1.2'}m
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pattern Cut Zones Table */}
                    <div className="p-4 rounded-sm bg-deep/30 border border-white/10 space-y-2 font-mono text-xs">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                        PANEL ALLOCATION LEDGER
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-white/40 block text-[9px]">Body / Torso</span>
                          <span className="text-white font-medium">MAT-001 (Denim)</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px]">Sleeves & Yoke</span>
                          <span className={isInvalid ? 'text-terracotta font-bold' : 'text-white font-medium'}>
                            {concept.uses[1] || 'MAT-003'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px]">Facings / Trim</span>
                          <span className="text-white font-medium">MAT-002 (Silk)</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[9px]">Calculated Waste</span>
                          <span className="text-yellow font-bold">12.4% Est.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar (Section 14) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/10 font-mono text-xs">
                    <button
                      onClick={() => onApproveConcept(concept.id)}
                      className={`px-4 py-2 rounded-sm font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        concept.approved
                          ? 'bg-yellow text-ink shadow'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{concept.approved ? 'Approved for Collection' : 'Approve Look'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isInvalid && (
                        <button
                          onClick={() => onRegenerateLook(concept.id)}
                          className="px-4 py-2 bg-yellow hover:bg-yellow/90 text-ink font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-sm shadow transition-all"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>Repair Look</span>
                        </button>
                      )}

                      <button
                        onClick={onNavigateToStudio}
                        className="px-4 py-2 bg-yellow hover:bg-yellow/90 text-ink font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-sm shadow transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>[ OPEN LIVE STUDIO ]</span>
                      </button>

                      <button
                        onClick={onNavigateToSheet}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white uppercase tracking-wider flex items-center gap-1.5 rounded-sm transition-colors"
                      >
                        <span>Export Tech Pack</span>
                        <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
