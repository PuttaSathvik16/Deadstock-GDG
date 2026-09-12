'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Camera,
  Layers,
  Video,
  ChevronRight,
  Scissors,
  CheckCircle2,
  Lock,
  Radio,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from '../Navbar';
import { KineticHeadline } from '../editorial/KineticHeadline';
import { ConstraintBadge } from '../editorial/ConstraintBadge';
import { MaterialDNA } from '../editorial/MaterialDNA';
import { AUTHENTIC_ATELIER_MATERIALS } from '@/lib/atelier-inventory';

interface LandingScreenProps {
  onStartLab: () => void;
  onExploreWorkspace: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

const STORY_BEATS = [
  {
    id: 1,
    number: '01',
    title: 'FIRST, WE LOOK.',
    subtitle: 'Physical remnants and surplus rolls framed in the physical studio.',
    accent: 'text-cobalt-electric',
  },
  {
    id: 2,
    number: '02',
    title: 'THEN WE UNDERSTAND.',
    subtitle: 'Gemini multimodal intelligence parses visual texture, weave, and yardage.',
    accent: 'text-yellow',
  },
  {
    id: 3,
    number: '03',
    title: 'THEN WE RESTRICT THE AI.',
    subtitle: 'Hard constraints lock: The algorithm cannot invent virgin fabric.',
    accent: 'text-yellow',
  },
  {
    id: 4,
    number: '04',
    title: 'THEN WE DESIGN.',
    subtitle: '1:1 traceable silhouettes synthesized strictly from physical offcuts.',
    accent: 'text-cobalt-electric',
  },
  {
    id: 5,
    number: '05',
    title: 'THEN HUMANS DECIDE.',
    subtitle: 'Live co-design critiques over Vonage Video drive causal regenerations.',
    accent: 'text-mint',
  },
];

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartLab,
  onExploreWorkspace,
  onNavigateTab,
}) => {
  const [activeBeat, setActiveBeat] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState<boolean>(false);

  const handleStartWorkspaceClick = () => {
    setIsCreatingWorkspace(true);
    setTimeout(() => {
      setIsCreatingWorkspace(false);
      onNavigateTab('scan');
    }, 600);
  };

  // Auto-advance narrative beats unless user manually clicks
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveBeat((prev) => (prev % STORY_BEATS.length) + 1);
    }, 4800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden bg-night text-bone">
      {/* Background Micro Grid & Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cobalt/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-yellow/10 blur-[130px]" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-16 w-full z-10">
        {/* Editorial Top Status Bar (Section 5) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-bone font-bold tracking-wider">DEADSTOCK / LIVE LAB</span>
            <span className="text-white/20">•</span>
            <span className="text-bone/60 hidden sm:inline">AUTONOMOUS MATERIAL CO-DESIGN</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-0.5 rounded-[2px] bg-yellow/10 border border-yellow/40 text-yellow text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
              <span>STRICT NO-NEW-FABRIC MANDATE</span>
            </div>
            <span className="text-bone/80 font-bold">MATERIAL-CONSTRAINED CO-DESIGN / 01</span>
          </div>
        </div>

        {/* Hero Viewport: 3-Column Award-Level Composition (Section 45) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (42% / 5 cols): Kinetic Headline & Primary Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-white/5 border border-white/10 font-mono text-[11px] text-bone/80 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
              Circular Fashion Intelligence
            </div>

            {/* Kinetic Headline: DESIGN WITH WHAT EXISTS. */}
            <KineticHeadline
              lines={['DESIGN', 'WITH', 'WHAT', 'EXISTS.']}
              accentLineIndex={3}
              accentWord="EXISTS."
              className="text-5xl sm:text-7xl xl:text-8xl tracking-tighter"
            />

            <p className="text-base sm:text-lg text-bone/70 max-w-lg font-light leading-relaxed">
              Scan leftover fabrics on your cutting table. Lock the physical inventory.
              Synthesize a manufacturable capsule collection without inventing yardage.
            </p>

            {/* Core Non-Negotiable Ground Rule (Section 1) */}
            <div className="p-4 rounded-[4px] bg-ink-soft border-l-2 border-yellow border-y border-r border-white/10 text-xs font-mono space-y-1">
              <div className="text-yellow font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                The Non-Negotiable Ground Rule
              </div>
              <p className="text-bone/70 leading-relaxed font-sans text-xs">
                The AI is strictly prohibited from imagining new fabrics. Every seam, collar,
                and sleeve traces 1:1 back to verified mill deadstock in the Supabase ledger.
              </p>
            </div>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleStartWorkspaceClick}
                data-cursor="pointer"
                disabled={isCreatingWorkspace}
                className="px-6 py-3.5 rounded-[2px] bg-yellow hover:bg-yellow-hover text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_24px_rgba(242,255,85,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isCreatingWorkspace ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    <span>Creating your workspace...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Start a Live Lab</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={onExploreWorkspace}
                data-cursor="pointer"
                className="px-6 py-3.5 rounded-[2px] bg-ink-surface hover:bg-white/10 text-bone font-mono text-xs uppercase tracking-wider border border-white/15 flex items-center gap-2 transition-all hover:border-yellow/40"
              >
                <span>Enter Live Studio</span>
                <ChevronRight className="w-4 h-4 text-yellow" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 font-mono">
              <div>
                <div className="text-2xl font-black text-bone">100%</div>
                <div className="text-[10px] text-bone/50 tracking-wider uppercase mt-0.5">Physical Provenance</div>
              </div>
              <div>
                <div className="text-2xl font-black text-yellow">87%+</div>
                <div className="text-[10px] text-bone/50 tracking-wider uppercase mt-0.5">Remnant Utilization</div>
              </div>
              <div>
                <div className="text-2xl font-black text-cobalt-electric">0 yds</div>
                <div className="text-[10px] text-bone/50 tracking-wider uppercase mt-0.5">Virgin Fabric Required</div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN (38% / 4.5 cols): The 5-Beat Interactive Hero Story (Section 6) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Beat Controller Header */}
            <div className="flex items-center justify-between bg-ink-soft/90 px-3 py-2 rounded-[2px] border border-white/10 text-[11px] font-mono">
              <span className="text-bone/60 uppercase">The 5-Beat Transformation</span>
              <div className="flex items-center gap-1.5">
                {STORY_BEATS.map((beat) => (
                  <button
                    key={beat.id}
                    onClick={() => {
                      setActiveBeat(beat.id);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-5 h-5 rounded-[2px] font-bold transition-all ${
                      activeBeat === beat.id
                        ? 'bg-yellow text-ink'
                        : 'bg-white/5 text-bone/50 hover:bg-white/10'
                    }`}
                  >
                    {beat.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Beat Presentation Canvas */}
            <div className="relative rounded-[4px] overflow-hidden border border-white/15 bg-ink-soft min-h-[440px] flex flex-col justify-between p-5 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBeat}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  {/* Active Beat Title */}
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-bone/40 uppercase">
                      BEAT {STORY_BEATS[activeBeat - 1].number} OF 05
                    </div>
                    <h3 className={`font-display text-2xl font-black tracking-tight ${STORY_BEATS[activeBeat - 1].accent}`}>
                      {STORY_BEATS[activeBeat - 1].title}
                    </h3>
                    <p className="text-xs text-bone/70 mt-1">
                      {STORY_BEATS[activeBeat - 1].subtitle}
                    </p>
                  </div>

                  {/* Beat Visual Composition */}
                  {activeBeat === 1 && (
                    <div className="space-y-3 pt-2">
                      <div className="relative rounded-[2px] overflow-hidden border border-white/15 aspect-[16/10]">
                        <img
                          src={AUTHENTIC_ATELIER_MATERIALS[0].provenance?.source_image}
                          alt="Raw denim"
                          className="w-full h-full object-cover"
                        />
                        <div className="animate-scanline" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink/90 border border-white/20 font-mono text-[10px] text-yellow">
                          RAW SPECIMEN DETECTED
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded bg-ink-surface border border-white/10 text-[10px]">
                          <span className="text-bone/50 block">ROLL 01</span>
                          <span className="text-bone font-bold">Indigo Selvedge Denim</span>
                        </div>
                        <div className="p-2 rounded bg-ink-surface border border-white/10 text-[10px]">
                          <span className="text-bone/50 block">PANEL 02</span>
                          <span className="text-bone font-bold">Mulberry Silk Organza</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBeat === 2 && (
                    <div className="space-y-2.5 pt-2">
                      {AUTHENTIC_ATELIER_MATERIALS.slice(0, 3).map((mat) => (
                        <MaterialDNA key={mat.id} material={mat} compact={false} />
                      ))}
                    </div>
                  )}

                  {activeBeat === 3 && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3.5 rounded bg-yellow/10 border-2 border-yellow text-xs font-mono space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-yellow uppercase flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            HARD INVENTORY CEILING
                          </span>
                          <span className="text-[10px] text-yellow/80">LOCKED</span>
                        </div>
                        <p className="text-bone/90 text-xs">
                          All generative paths constrained: Zero virgin fibers. Concepts referencing unapproved materials will be rejected.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ConstraintBadge label="NO VIRGIN YARDAGE" variant="locked" />
                        <ConstraintBadge label="USE VERIFIED ONLY" variant="locked" />
                        <ConstraintBadge label="MAX 3 LOOKS" variant="locked" />
                        <ConstraintBadge label="WASTE CEILING 12%" variant="active" />
                      </div>
                    </div>
                  )}

                  {activeBeat === 4 && (
                    <div className="space-y-3 pt-2">
                      <div className="relative rounded-[2px] overflow-hidden border border-white/15 aspect-[16/10]">
                        <img
                          src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80"
                          alt="Garment silhouette"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs font-mono">
                          <span className="text-yellow font-bold">LOOK 01 • WORK KIMONO</span>
                          <span className="px-1.5 py-0.5 rounded bg-cobalt text-bone text-[10px]">
                            FEASIBLE 100%
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-ink-surface border border-white/10 font-mono text-[11px] space-y-1">
                        <div className="flex justify-between text-bone/70">
                          <span>Bodice / Sleeves</span>
                          <span className="text-bone">MAT-001 (Denim)</span>
                        </div>
                        <div className="flex justify-between text-bone/70">
                          <span>Internal Facing</span>
                          <span className="text-bone">MAT-002 (Silk)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeBeat === 5 && (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 rounded bg-ink-surface border border-white/10 font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-mint font-bold flex items-center gap-1.5">
                            <Radio className="w-3 h-3 text-mint animate-pulse" />
                            LIVE STUDIO REVIEW
                          </span>
                          <span className="text-[10px] text-bone/60">Vonage WebRTC</span>
                        </div>
                        <p className="text-bone/80 text-xs font-sans">
                          Sathvik (Lead Upcycler) purged the Silk Satin roll due to oil spotting. The constraint engine immediately updated Look 03.
                        </p>
                      </div>
                      <div className="p-2.5 rounded bg-yellow/15 border border-yellow font-mono text-[10px] text-yellow flex items-center justify-between">
                        <span>LOOK 03 INVALIDATED → REGENERATED</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Step Advance Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-bone/60">
                <span>SCROLL STORY 0{activeBeat} / 05</span>
                <button
                  onClick={() => {
                    setActiveBeat((prev) => (prev % STORY_BEATS.length) + 1);
                    setIsAutoPlaying(false);
                  }}
                  className="text-yellow hover:underline flex items-center gap-1 font-bold"
                >
                  Next Step <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (20% / 3 cols): Physical Material Ledger & Specs (Section 45) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
              <span className="text-bone font-bold uppercase tracking-wider">Active Surplus Lot</span>
              <span className="text-yellow">7 SPECIMENS</span>
            </div>

            <div className="space-y-2.5">
              {AUTHENTIC_ATELIER_MATERIALS.slice(0, 4).map((mat) => (
                <div
                  key={mat.id}
                  data-cursor="inspect"
                  onClick={() => onNavigateTab('inventory')}
                  className="cursor-pointer group p-2.5 rounded-[2px] bg-ink-soft hover:bg-ink-surface border border-white/10 hover:border-yellow/50 transition-all font-mono"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-yellow font-bold">{mat.id}</span>
                    <span className="text-bone/50">{mat.verification}</span>
                  </div>
                  <div className="text-xs font-semibold text-bone group-hover:text-yellow transition-colors truncate mt-0.5">
                    {mat.label}
                  </div>
                  <div className="text-[10px] text-bone/60 flex items-center justify-between mt-1">
                    <span>{mat.estimate?.quantity_estimate?.value} {mat.estimate?.quantity_estimate?.unit}</span>
                    <span>{Math.round(mat.confidence * 100)}% conf</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('inventory')}
              data-cursor="pointer"
              className="w-full py-2.5 rounded-[2px] bg-ink-surface hover:bg-white/10 border border-white/15 text-bone font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5 text-yellow" />
            </button>
          </div>
        </div>

        {/* 4-Step Architectural Loop (Section 1) */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-1">
            <span className="font-mono text-xs text-yellow uppercase tracking-widest">
              The Architecture of Constraint
            </span>
            <h2 className="font-display text-3xl font-bold text-bone">
              How Physical Leftovers Drive AI Generation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigateTab('scan')}
              data-cursor="pointer"
              className="cursor-pointer group p-5 rounded-[2px] bg-ink-soft border border-white/10 hover:border-yellow transition-all corner-notch"
            >
              <div className="w-10 h-10 rounded-[2px] bg-ink-surface border border-white/15 flex items-center justify-center text-yellow mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div className="font-mono text-[10px] text-bone/50 mb-1">01 / CAPTURE</div>
              <h3 className="font-display font-semibold text-bone text-base mb-2 group-hover:text-yellow transition-colors">
                Live Video Inspection
              </h3>
              <p className="text-xs text-bone/70 leading-relaxed">
                Frame your fabric bolts, cutting offcuts, and brass hardware. Gemini multimodal
                parses visible textures without inventing fiber truth.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('inventory')}
              data-cursor="pointer"
              className="cursor-pointer group p-5 rounded-[2px] bg-ink-soft border border-white/10 hover:border-cobalt-electric transition-all corner-notch"
            >
              <div className="w-10 h-10 rounded-[2px] bg-ink-surface border border-white/15 flex items-center justify-center text-cobalt-electric mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="font-mono text-[10px] text-bone/50 mb-1">02 / STRUCTURE</div>
              <h3 className="font-display font-semibold text-bone text-base mb-2 group-hover:text-cobalt-lavender transition-colors">
                Material Ledger
              </h3>
              <p className="text-xs text-bone/70 leading-relaxed">
                Turn visual guesses into authoritative inventory in Supabase. Expose confidence,
                verify assumptions, and lock approved textiles.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('concepts')}
              data-cursor="pointer"
              className="cursor-pointer group p-5 rounded-[2px] bg-ink-soft border border-white/10 hover:border-yellow transition-all corner-notch"
            >
              <div className="w-10 h-10 rounded-[2px] bg-ink-surface border border-white/15 flex items-center justify-center text-yellow mb-4 group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5" />
              </div>
              <div className="font-mono text-[10px] text-bone/50 mb-1">03 / CONSTRAIN</div>
              <h3 className="font-display font-semibold text-bone text-base mb-2 group-hover:text-yellow transition-colors">
                Concept Synthesis
              </h3>
              <p className="text-xs text-bone/70 leading-relaxed">
                AI generates silhouettes mapped 1:1 to your material IDs. Every pocket, sleeve, and
                panel traces to real physical inventory.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('studio')}
              data-cursor="pointer"
              className="cursor-pointer group p-5 rounded-[2px] bg-ink-soft border border-white/10 hover:border-mint transition-all corner-notch"
            >
              <div className="w-10 h-10 rounded-[2px] bg-ink-surface border border-white/15 flex items-center justify-center text-mint mb-4 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div className="font-mono text-[10px] text-bone/50 mb-1">04 / COLLABORATE</div>
              <h3 className="font-display font-semibold text-bone text-base mb-2 group-hover:text-mint transition-colors">
                Real-Time Propagation
              </h3>
              <p className="text-xs text-bone/70 leading-relaxed">
                Review with co-designers over Vonage Video. Quash a fabric live and watch dependent
                concepts re-synthesize instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Bottom Meta Bar (Section 5) */}
        <div className="mt-16 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-bone/50">
          <div>GEMINI × VONAGE × MATERIAL INTELLIGENCE</div>
          <div>SCROLL INDEX: 01 / 07</div>
        </div>
      </div>
    </div>
  );
};
