'use client';

import React from 'react';
import {
  Layers,
  Sparkles,
  Video,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Scissors,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Lab, Material, Concept, Decision, Constraint } from '@/types';
import { ActiveTab } from '../Navbar';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface OverviewScreenProps {
  lab: Lab;
  materials: Material[];
  concepts: Concept[];
  constraints: Constraint[];
  decisions: Decision[];
  materialUtilizationPct: number;
  onNavigateTab: (tab: ActiveTab) => void;
  onTriggerFabricDisruption: () => void;
  isFabricDisrupted: boolean;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  lab,
  materials,
  concepts,
  constraints,
  decisions,
  materialUtilizationPct,
  onNavigateTab,
  onTriggerFabricDisruption,
  isFabricDisrupted,
}) => {
  const approvedMaterials = materials.filter((m) => m.approved);
  const invalidConcepts = concepts.filter((c) => c.affected);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Hero Banner (Section 45) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="corner-notch relative p-8 sm:p-10 bg-gradient-to-br from-deep via-night to-deep/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Ambient glow accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-royal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-yellow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
                01 // ATELIER REAL-TIME DOSSIER
              </span>
              <span className="text-white/30 font-mono text-xs">•</span>
              <span className="font-mono text-xs text-white/60">
                LEAD UPCYCLER: <strong className="text-white">Sathvik</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
              <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-electric">
                SUPABASE PG-17
              </span>
              <span>LOT ID: {lab.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[0.92]">
                {lab.name}
              </h1>
              <p className="text-base sm:text-lg text-paper/80 font-light max-w-2xl leading-relaxed">
                "{lab.brief}"
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-white/50">
                <span className="text-yellow uppercase font-bold">TARGET AUDIENCE:</span>
                <span className="text-white/90">{lab.audience}</span>
                <span className="text-white/30">•</span>
                <span className="text-yellow uppercase font-bold">OCCASION:</span>
                <span className="text-white/90">{lab.occasion}</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => onNavigateTab('studio')}
                className="w-full px-5 py-3 rounded-sm bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-[0_0_25px_rgba(242,255,85,0.3)] transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-ink" />
                  <span>Enter Live Studio</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('concepts')}
                className="w-full px-5 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-electric" />
                  <span>Inspect {concepts.length} Capsule Looks</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Signature Live Physical Disruption Interactive Highlight Box (Sections 16 & 17) */}
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`corner-notch p-6 sm:p-8 border-2 transition-all relative overflow-hidden ${
          isFabricDisrupted
            ? 'border-terracotta bg-terracotta/10 shadow-[0_0_30px_rgba(255,107,107,0.2)]'
            : 'border-yellow/30 bg-deep/30'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                  isFabricDisrupted
                    ? 'bg-terracotta text-white'
                    : 'bg-yellow text-ink'
                }`}
              >
                {isFabricDisrupted ? (
                  <>
                    <AlertTriangle className="w-3 h-3 animate-pulse" />
                    CAUSAL PROPAGATION ACTIVE
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    PRD 7.3 & SECTION 17 SIGNATURE DEMO
                  </>
                )}
              </span>
              <span className="font-mono text-xs text-white/50">
                {isFabricDisrupted
                  ? 'BURGUNDY SATIN (MAT-004) PURGED'
                  : 'ALL FABRICS GROUNDED'}
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl text-white tracking-tight">
              {isFabricDisrupted
                ? 'Burgundy Satin Purged: Look 02 Invalidated in Supabase'
                : 'Test Live Material Disruption & Real-Time Causal Chain'}
            </h3>

            <p className="text-xs sm:text-sm text-paper/70 max-w-3xl leading-relaxed">
              {isFabricDisrupted
                ? 'Look 02 turned amber because its lantern sleeves depend on MAT-004. Untouched looks (Look 01 & 03) remain locked and feasible. Restore satin or regenerate affected zones via Gemini.'
                : 'Click Purge Satin to simulate a sudden yardage shortage on the cutting table. The system propagates the disruption across the dependency graph, marks dependent zones invalid, and offers targeted zone repair.'}
            </p>

            {/* Micro Causal Chain Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-sm bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Step 01</span>
                <span className="text-white font-medium">Physical Fabric Disappears</span>
              </div>
              <div className="p-2.5 rounded-sm bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Step 02</span>
                <span className={isFabricDisrupted ? 'text-terracotta font-bold' : 'text-white/70'}>
                  Look 02 Dependency Breaks
                </span>
              </div>
              <div className="p-2.5 rounded-sm bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Step 03</span>
                <span className="text-yellow font-medium">Targeted Zone Re-synthesis</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={onTriggerFabricDisruption}
              className={`px-6 py-3.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                isFabricDisrupted
                  ? 'bg-yellow hover:bg-yellow/90 text-ink shadow-[0_0_20px_rgba(242,255,85,0.3)]'
                  : 'bg-terracotta hover:bg-terracotta/90 text-white shadow-[0_0_20px_rgba(255,107,107,0.3)]'
              }`}
            >
              {isFabricDisrupted ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Burgundy Satin</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Purge Satin Live</span>
                </>
              )}
            </button>
            {isFabricDisrupted && (
              <button
                onClick={() => onNavigateTab('concepts')}
                className="px-4 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <Scissors className="w-3.5 h-3.5 text-yellow" />
                <span>View Affected Zone</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4 Industrial Metric Tiles (Section 45) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('inventory')}
          className="corner-notch cursor-pointer p-6 bg-deep/30 border border-white/10 hover:border-yellow/50 transition-all group relative"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-3 uppercase tracking-wider">
            <span>03 // PHYSICAL STOCK</span>
            <Layers className="w-4 h-4 text-yellow group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-4xl font-bold text-white tracking-tight">
            {approvedMaterials.length}{' '}
            <span className="text-xs font-normal text-white/40">/ {materials.length} LOTS</span>
          </div>
          <div className="text-xs text-yellow font-mono mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span>14.8m Estimated Usable Stock</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('constraints')}
          className="corner-notch cursor-pointer p-6 bg-deep/30 border border-white/10 hover:border-electric/50 transition-all group relative"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-3 uppercase tracking-wider">
            <span>04 // CONSTRAINTS</span>
            <ShieldCheck className="w-4 h-4 text-electric group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-4xl font-bold text-white tracking-tight">
            {constraints.filter((c) => c.active).length}{' '}
            <span className="text-xs font-normal text-white/40">ACTIVE</span>
          </div>
          <div className="text-xs text-electric font-mono mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
            <span>0 Ungrounded Fabrics Rule</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('concepts')}
          className="corner-notch cursor-pointer p-6 bg-deep/30 border border-white/10 hover:border-yellow/50 transition-all group relative"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-3 uppercase tracking-wider">
            <span>05 // CAPSULE LOOKS</span>
            <Sparkles className="w-4 h-4 text-yellow group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-4xl font-bold text-white tracking-tight">
            0{concepts.length}
          </div>
          <div className="text-xs font-mono mt-2">
            {invalidConcepts.length > 0 ? (
              <span className="text-terracotta flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                <span>{invalidConcepts.length} Look Requires Zone Repair</span>
              </span>
            ) : (
              <span className="text-yellow flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Manufacturable</span>
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('sheet')}
          className="corner-notch cursor-pointer p-6 bg-deep/30 border border-white/10 hover:border-white/30 transition-all group relative"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-3 uppercase tracking-wider">
            <span>07 // YARDAGE UTILITY</span>
            <TrendingUp className="w-4 h-4 text-paper group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-mono text-4xl font-bold text-yellow tracking-tight">
            {materialUtilizationPct}%
          </div>
          <div className="text-xs text-white/60 font-mono mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span>Zero Virgin Material Rule</span>
          </div>
        </motion.div>
      </div>

      {/* Capsule Looks Editorial Gallery (Section 14) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="font-mono text-[11px] text-yellow tracking-widest uppercase">
              05 // MANUFACTURED CAPSULE
            </div>
            <h3 className="font-display text-2xl font-bold text-white mt-1">
              Active Collection Concepts
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('concepts')}
            className="text-xs font-mono text-yellow hover:underline flex items-center gap-1.5 uppercase tracking-wider font-semibold"
          >
            <span>Open Trace Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {concepts.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -4 }}
              onClick={() => onNavigateTab('concepts')}
              className={`corner-notch cursor-pointer group rounded-none overflow-hidden border transition-all bg-deep/20 ${
                c.affected
                  ? 'border-terracotta shadow-[0_0_20px_rgba(255,107,107,0.3)]'
                  : 'border-white/10 hover:border-yellow/60'
              }`}
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-night">
                <img
                  src={c.visual_uri}
                  alt={c.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${
                    c.affected ? 'grayscale opacity-75' : ''
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40 pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-night/90 border border-white/15 px-2.5 py-1 text-xs font-mono font-bold text-white">
                    LOOK 0{c.look_number}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  {c.affected ? (
                    <span className="bg-terracotta text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                      ZONE INVALID
                    </span>
                  ) : (
                    <span className="bg-yellow text-ink px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                      FEASIBLE
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <div className="font-mono text-[10px] text-yellow uppercase tracking-wider">
                    {c.silhouette}
                  </div>
                  <h4 className="font-display font-bold text-white text-lg group-hover:text-yellow transition-colors leading-tight">
                    {c.title}
                  </h4>
                </div>
              </div>

              <div className="p-5 space-y-3 bg-night/90 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40 uppercase">Traceability</span>
                  <span className="text-white/80 font-bold">{c.uses.join(' • ')}</span>
                </div>

                <div className="text-[11px] text-paper/70 font-mono line-clamp-2 leading-relaxed">
                  {c.description}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/40">Cut Waste Est.</span>
                  <span className="text-yellow font-bold">~14%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
