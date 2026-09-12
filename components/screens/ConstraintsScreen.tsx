'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  HelpCircle,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Percent,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Constraint } from '@/types';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface ConstraintsScreenProps {
  constraints: Constraint[];
  onToggleConstraint: (id: string) => void;
  onAddConstraint: (newConstraint: Constraint) => void;
  onNavigateToConcepts: () => void;
}

export const ConstraintsScreen: React.FC<ConstraintsScreenProps> = ({
  constraints,
  onToggleConstraint,
  onAddConstraint,
  onNavigateToConcepts,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newType, setNewType] = useState<'HARD' | 'SOFT'>('HARD');

  // Soft weights sliders state (Section 12)
  const [softWeights, setSoftWeights] = useState<Record<string, number>>({
    'c-soft-1': 85,
    'c-soft-2': 70,
    'c-soft-3': 90,
  });

  const hardConstraints = constraints.filter((c) => c.type === 'HARD');
  const softConstraints = constraints.filter((c) => c.type === 'SOFT');

  const handleWeightChange = (id: string, val: number) => {
    setSoftWeights((prev) => ({ ...prev, [id]: val }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRule) return;

    onAddConstraint({
      id: `custom-${Date.now()}`,
      type: newType,
      source: 'user',
      title: newTitle,
      rule: newRule,
      description: 'Custom atelier constraint enforced by Lead Upcycler Sathvik.',
      severity: newType === 'HARD' ? 'critical' : 'info',
      active: true,
    });

    setNewTitle('');
    setNewRule('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title (Section 12: CONSTRAIN THE CREATIVE.) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>04 // CREATIVE BOUNDARIES</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">MATERIAL-DRIVEN RULES</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-1">
            CONSTRAIN THE CREATIVE.
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-1 max-w-2xl">
            AI cannot hallucinate fabric. Hard rules strictly forbid ungrounded virgin textiles; soft preferences bias panel balance and cutting efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-yellow" />
            <span>Add Rule</span>
          </button>

          <button
            onClick={onNavigateToConcepts}
            className="px-5 py-2.5 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm shadow-[0_0_20px_rgba(242,255,85,0.3)] transition-all"
          >
            <span>Compose Capsule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Custom Rule Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddSubmit}
          className="corner-notch p-6 bg-deep/40 border border-yellow/50 space-y-4 shadow-xl"
        >
          <div className="font-mono text-xs text-yellow font-bold uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Define Custom Studio Rule</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Rule Title</label>
              <input
                type="text"
                placeholder="e.g. Forbid Synthetic Linings"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-night border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-yellow"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Exact Condition</label>
              <input
                type="text"
                placeholder="e.g. ALL_LININGS ∈ NATURAL_FIBERS"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="w-full px-3 py-2 bg-night border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-yellow"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">Enforcement Level</label>
              <div className="flex gap-2">
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="flex-1 px-3 py-2 bg-night border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-yellow"
                >
                  <option value="HARD">HARD (Lock / Inviolable)</option>
                  <option value="SOFT">SOFT (Preference Weight)</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow text-ink font-mono font-bold text-xs uppercase"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* 3-Column Constraint Workspace (Section 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Physical Yardage Authority (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs text-yellow font-bold uppercase tracking-wider">
                PHYSICAL INVENTORY BOUNDS
              </span>
              <span className="text-[10px] font-mono text-white/40">GROUND TRUTH</span>
            </div>

            <p className="text-xs text-paper/70 font-mono leading-relaxed">
              Every generation prompt sent to Gemini 3.6 Flash includes this verified yardage table. Any design requiring non-existent yardage fails validation.
            </p>

            <div className="space-y-2 pt-2">
              <div className="p-3 bg-night/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">MAT-001 • Navy Denim</span>
                  <span className="text-white/40 text-[10px]">12.5oz Twill Roll</span>
                </div>
                <span className="text-yellow font-bold">4.2m available</span>
              </div>

              <div className="p-3 bg-night/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">MAT-002 • Mulberry Raw Silk</span>
                  <span className="text-white/40 text-[10px]">Natural Slub Remnant</span>
                </div>
                <span className="text-yellow font-bold">2.8m available</span>
              </div>

              <div className="p-3 bg-night/80 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">MAT-003 • Olive Heavy Twill</span>
                  <span className="text-white/40 text-[10px]">Deadstock Cotton</span>
                </div>
                <span className="text-yellow font-bold">3.5m available</span>
              </div>

              <div className="p-3 bg-night/80 border border-terracotta/30 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">MAT-004 • Burgundy Satin</span>
                  <span className="text-terracotta text-[10px]">Quarantine / Causal Test Lot</span>
                </div>
                <span className="text-terracotta font-bold">1.8m (Quarantined)</span>
              </div>
            </div>
          </div>

          {/* Realism Disclaimer (Section 12 Note) */}
          <div className="p-4 rounded-sm bg-white/5 border border-white/10 text-[11px] font-mono text-white/60 space-y-1.5">
            <div className="text-yellow flex items-center gap-1.5 font-bold uppercase text-[10px]">
              <Info className="w-3.5 h-3.5" />
              <span>PHYSICAL ESTIMATE NOTICE</span>
            </div>
            <p>
              Manufacturability models calculate 2D pattern nested cut areas from verified measurements. Tailoring ease and seam allowances are estimated conservatively (~15% margin).
            </p>
          </div>
        </div>

        {/* Center Column: The Constraint Stack (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* HARD CONSTRAINTS (Section 12) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-yellow" />
                HARD CONSTRAINTS (INVIOLABLE)
              </span>
              <span className="font-mono text-[10px] text-yellow">0% TOLERANCE</span>
            </div>

            <div className="space-y-3">
              {hardConstraints.map((c) => (
                <div
                  key={c.id}
                  className={`corner-notch p-4 border transition-all ${
                    c.active
                      ? 'bg-deep/40 border-yellow/40'
                      : 'bg-night/40 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-yellow" />
                        <h4 className="font-display font-bold text-white text-sm tracking-tight">
                          {c.title}
                        </h4>
                      </div>
                      <p className="font-mono text-xs text-paper/70 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="text-[10px] font-mono text-yellow pt-1">
                        RULE: <code className="bg-night px-1.5 py-0.5 border border-white/10">{c.rule}</code>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleConstraint(c.id)}
                      className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        c.active
                          ? 'bg-yellow text-ink'
                          : 'bg-white/10 text-white/50 hover:bg-white/20'
                      }`}
                    >
                      {c.active ? 'ENFORCED' : 'OFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOFT CONSTRAINTS (Section 12: Weight Sliders) */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-electric" />
                SOFT PREFERENCES (WEIGHTED)
              </span>
              <span className="font-mono text-[10px] text-electric">OPTIMIZATION BIAS</span>
            </div>

            <div className="space-y-3">
              {softConstraints.map((c) => {
                const weight = softWeights[c.id] || 75;
                return (
                  <div
                    key={c.id}
                    className={`corner-notch p-4 border transition-all ${
                      c.active
                        ? 'bg-deep/30 border-white/15'
                        : 'bg-night/40 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">
                            {c.title}
                          </h4>
                          <p className="font-mono text-xs text-paper/70 mt-0.5">
                            {c.description}
                          </p>
                        </div>
                        <button
                          onClick={() => onToggleConstraint(c.id)}
                          className={`px-2 py-0.5 rounded-sm font-mono text-[10px] uppercase font-bold ${
                            c.active ? 'bg-electric text-white' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {c.active ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>

                      {/* Section 12 Slider */}
                      {c.active && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[10px] font-mono text-white/60">
                            <span>PREFERENCE BIAS</span>
                            <span className="text-electric font-bold">{weight}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={weight}
                            onChange={(e) => handleWeightChange(c.id, Number(e.target.value))}
                            className="w-full accent-electric bg-night h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Compliance Engine Preview (col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="corner-notch p-6 bg-deep/40 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs text-yellow font-bold uppercase tracking-wider">
                COMPLIANCE PREVIEW
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-night/80 border border-white/10 space-y-1">
                <span className="text-white/40 block text-[10px] uppercase">Active Hard Rules</span>
                <span className="text-lg font-bold text-white">
                  0{hardConstraints.filter((c) => c.active).length} / 0{hardConstraints.length}
                </span>
                <span className="text-[10px] text-yellow block">100% Guaranteed Non-Virgin</span>
              </div>

              <div className="p-3 bg-night/80 border border-white/10 space-y-1">
                <span className="text-white/40 block text-[10px] uppercase">Silhouette Ceiling</span>
                <span className="text-lg font-bold text-white">03 Capsule Looks</span>
                <span className="text-[10px] text-white/60 block">Allocated to 14.8m Lot</span>
              </div>

              <div className="p-3 bg-night/80 border border-white/10 space-y-1">
                <span className="text-white/40 block text-[10px] uppercase">Waste Target</span>
                <span className="text-lg font-bold text-electric">&lt; 18% Off-Cut</span>
                <span className="text-[10px] text-white/60 block">Zero Virgin Off-cuts</span>
              </div>
            </div>

            <button
              onClick={onNavigateToConcepts}
              className="w-full py-3 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow-[0_0_15px_rgba(242,255,85,0.3)] transition-all"
            >
              <span>Verify & Compose</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
