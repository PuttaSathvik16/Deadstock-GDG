'use client';

import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Lock,
  Unlock,
  Edit3,
  Sliders,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  Check,
  RotateCcw,
  Plus,
  X,
  Scan,
  Scissors,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Material } from '@/types';
import { MaterialDNA } from '../editorial/MaterialDNA';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface InventoryScreenProps {
  materials: Material[];
  onUpdateMaterial: (updated: Material) => void;
  onNavigateToConstraints: () => void;
  onNavigateToScan: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  materials,
  onUpdateMaterial,
  onNavigateToConstraints,
  onNavigateToScan,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(materials[0]?.id || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'review' | 'quarantined'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedMaterial = materials.find((m) => m.id === selectedId) || materials[0];

  // Stats calculation
  const approvedCount = materials.filter((m) => m.approved).length;
  const reviewCount = materials.filter((m) => m.verification === 'needs_review').length;
  const quarantinedCount = materials.filter((m) => !m.approved).length;
  const totalUsableMeters = materials
    .reduce((acc, m) => acc + (m.approved ? Number(m.estimate.quantity_estimate.value) : 0), 0)
    .toFixed(1);

  const filteredMaterials = materials.filter((m) => {
    if (filter === 'verified') return m.approved;
    if (filter === 'review') return m.verification === 'needs_review';
    if (filter === 'quarantined') return !m.approved;
    return true;
  });

  const handleOpenDrawer = (mat: Material) => {
    setSelectedId(mat.id);
    setIsDrawerOpen(true);
  };

  const toggleApproval = (material: Material) => {
    if (material.locked) return;
    onUpdateMaterial({
      ...material,
      approved: !material.approved,
      verification: !material.approved ? 'verified' : 'rejected',
    });
  };

  const toggleLock = (material: Material) => {
    onUpdateMaterial({
      ...material,
      locked: !material.locked,
      verification: !material.locked ? 'locked' : 'verified',
    });
  };

  // AI Reasoning explanations based on material attributes
  const getAiReasoning = (mat: Material) => {
    if (mat.category === 'denim') {
      return 'Multimodal visual analysis observed clear diagonal 3/1 right-hand twill weave, high-friction indigo wash wear patterns, and a 12.5oz rigid selvedge profile.';
    }
    if (mat.category === 'silk') {
      return 'Subtle lustre specular highlights, irregular slub filament threads, and high-drape fluidity indicate mulberry raw silk remnant with natural unbleached yarn.';
    }
    if (mat.category === 'corduroy') {
      return 'Distinct 8-wale vertical pile ribs, soft directional nap reflection, and medium-heavy cotton foundation confirm vintage deadstock corduroy roll.';
    }
    if (mat.category === 'satin') {
      return 'Continuous smooth filament warp floats, high directional reflection, and lightweight fluid drape confirm polyester/acetate surplus satin lining.';
    }
    return 'Surface texture, thread pitch, and edge fray analysis align with natural deadstock twill textile with minimal synthetic elasticity.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header (Section 10: MATERIAL LIBRARY) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>03 // MATERIAL INTELLIGENCE</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">PHYSICAL SPECIMENS</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight uppercase mt-1">
            MATERIAL LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-1">
            Archival surplus remnants authenticated via Gemini multimodal vision.
          </p>
        </div>

        {/* Top Metrics (Section 10) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-mono text-xs">
          <div className="p-3 bg-deep/40 border border-white/10 rounded-sm">
            <span className="text-white/50 block text-[10px] uppercase">Total Lots</span>
            <span className="text-lg font-bold text-white">0{materials.length} Materials</span>
          </div>
          <div className="p-3 bg-deep/40 border border-white/10 rounded-sm">
            <span className="text-white/50 block text-[10px] uppercase">Verified Stock</span>
            <span className="text-lg font-bold text-yellow">0{approvedCount} Verified</span>
          </div>
          <div className="p-3 bg-deep/40 border border-white/10 rounded-sm">
            <span className="text-white/50 block text-[10px] uppercase">Quarantined</span>
            <span className="text-lg font-bold text-terracotta">0{quarantinedCount} Quarantined</span>
          </div>
          <div className="p-3 bg-deep/40 border border-white/10 rounded-sm">
            <span className="text-white/50 block text-[10px] uppercase">Usable Stock</span>
            <span className="text-lg font-bold text-electric">{totalUsableMeters}m Usable</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 font-mono text-xs bg-deep/30 p-1 rounded-sm border border-white/10">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-yellow text-ink font-bold shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            All ({materials.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
              filter === 'verified'
                ? 'bg-yellow text-ink font-bold shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Verified ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
              filter === 'review'
                ? 'bg-yellow text-ink font-bold shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Review ({reviewCount})
          </button>
          <button
            onClick={() => setFilter('quarantined')}
            className={`px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
              filter === 'quarantined'
                ? 'bg-yellow text-ink font-bold shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Quarantined ({quarantinedCount})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToScan}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm transition-colors"
          >
            <Scan className="w-3.5 h-3.5 text-yellow" />
            <span>Scan Specimen</span>
          </button>

          <button
            onClick={onNavigateToConstraints}
            className="px-4 py-2 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-sm shadow-[0_0_15px_rgba(242,255,85,0.3)] transition-all"
          >
            <span>Lock Constraints</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Asymmetric Material Archive Grid (Section 10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((mat, idx) => {
          const isSelected = selectedId === mat.id;
          return (
            <motion.div
              key={mat.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleOpenDrawer(mat)}
              className={`corner-notch cursor-pointer group relative border transition-all overflow-hidden bg-night/80 flex flex-col justify-between ${
                mat.approved
                  ? 'border-white/10 hover:border-yellow/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  : 'border-terracotta/40 bg-terracotta/5'
              }`}
            >
              {/* Material Specimen Image with 1.04 Zoom Hover (Section 10) */}
              <div className="aspect-[4/3] relative overflow-hidden bg-deep">
                <img
                  src={mat.provenance.source_image}
                  alt={mat.label}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/40 pointer-events-none" />

                {/* Technical Corner Brackets / Reticle Overlay (Section 10) */}
                <div className="absolute inset-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow" />
                </div>

                {/* Top Material Code & Verification State */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-night/90 border border-white/15 text-white">
                    {mat.id}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/30 shadow"
                    style={{ backgroundColor: mat.visual.swatch_hex }}
                    title={mat.visual.dominant_color}
                  />
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {mat.locked && (
                    <span className="p-1 bg-royal/80 border border-royal text-white rounded-xs">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                  {mat.approved ? (
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-yellow text-ink">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-terracotta text-white">
                      QUARANTINED
                    </span>
                  )}
                </div>

                {/* Bottom Confidence & Stock Estimate */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-white/80 bg-night/80 px-2 py-0.5 border border-white/10">
                    CONFIDENCE: <strong className="text-yellow">{Math.round(mat.confidence * 100)}%</strong>
                  </span>
                  <span className="text-white/80 bg-night/80 px-2 py-0.5 border border-white/10">
                    {mat.estimate.quantity_estimate.value} {mat.estimate.quantity_estimate.unit}
                  </span>
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-5 space-y-3 bg-deep/20 border-t border-white/10">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    {mat.category} • {mat.form}
                  </div>
                  <h3 className="font-display font-bold text-white text-lg group-hover:text-yellow transition-colors leading-tight">
                    {mat.label}
                  </h3>
                </div>

                {/* Material DNA Preview */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/50">Pattern: <strong className="text-white/80">{mat.visual.pattern}</strong></span>
                  <span className="text-white/50">Drape: <strong className="text-electric">{mat.properties.weight_class_guess}</strong></span>
                </div>

                {/* Hover CTA Indicator */}
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-yellow group-hover:translate-x-1 transition-transform">
                  <span className="uppercase tracking-wider">Click to Inspect DNA Drawer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full-Height Material Detail Drawer (Section 11) */}
      <AnimatePresence>
        {isDrawerOpen && selectedMaterial && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-night/80 backdrop-blur-sm"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-night border-l border-white/15 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-yellow px-2 py-0.5 bg-white/5 border border-yellow/40">
                      {selectedMaterial.id}
                    </span>
                    <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                      SPECIMEN INSPECTOR
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* High-Res Image & Reticle Zone */}
                <div className="aspect-[16/10] relative rounded-none border border-white/10 overflow-hidden bg-deep">
                  <img
                    src={selectedMaterial.provenance.source_image}
                    alt={selectedMaterial.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-4 border border-yellow/30 pointer-events-none flex flex-col justify-between p-2 font-mono text-[9px]">
                    <div className="flex justify-between text-yellow bg-night/80 px-2 py-1">
                      <span>MULTIMODAL BOUNDING BOX</span>
                      <span>SWATCH: {selectedMaterial.visual.dominant_color}</span>
                    </div>
                    <div className="text-right text-white/60 bg-night/80 px-2 py-1">
                      COLOR CODE: {selectedMaterial.visual.swatch_hex}
                    </div>
                  </div>
                </div>

                {/* Material Titles & DNA Block (Section 44) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                      {selectedMaterial.label}
                    </h2>
                    <span className="font-mono text-sm text-yellow font-bold">
                      {Math.round(selectedMaterial.confidence * 100)}% CONFIDENCE
                    </span>
                  </div>

                  <MaterialDNA material={selectedMaterial} />
                </div>

                {/* Section 11: "WHY THE AI THINKS THIS" Reasoning Box */}
                <div className="corner-notch p-5 bg-deep/40 border border-yellow/40 space-y-2">
                  <div className="font-mono text-[10px] text-yellow uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>WHY THE AI THINKS THIS (SECTION 11)</span>
                  </div>
                  <p className="font-mono text-xs text-paper leading-relaxed">
                    {getAiReasoning(selectedMaterial)}
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>Source: Gemini Multimodal Vision Pipeline</span>
                    <span>Status: {selectedMaterial.verification.toUpperCase()}</span>
                  </div>
                </div>

                {/* Properties Table */}
                <div className="space-y-3 border-t border-white/10 pt-4 font-mono text-xs">
                  <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                    SPECIFICATION BREAKDOWN
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Category</span>
                      <span className="text-white font-semibold capitalize">{selectedMaterial.category}</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Form Factor</span>
                      <span className="text-white font-semibold capitalize">{selectedMaterial.form}</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Quantity In Lot</span>
                      <span className="text-yellow font-semibold">
                        {selectedMaterial.estimate.quantity_estimate.value} {selectedMaterial.estimate.quantity_estimate.unit}
                      </span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Weight Class</span>
                      <span className="text-white font-semibold">{selectedMaterial.properties.weight_class_guess}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Section 11) */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleApproval(selectedMaterial)}
                    disabled={selectedMaterial.locked}
                    className={`py-3 px-4 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all ${
                      selectedMaterial.approved
                        ? 'bg-terracotta/20 text-terracotta hover:bg-terracotta/30 border border-terracotta/40'
                        : 'bg-yellow text-ink hover:bg-yellow/90 shadow'
                    } disabled:opacity-40`}
                  >
                    {selectedMaterial.approved ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Quarantine Specimen</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Specimen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleLock(selectedMaterial)}
                    className={`py-3 px-4 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all border ${
                      selectedMaterial.locked
                        ? 'bg-royal/20 text-electric border-royal'
                        : 'bg-white/5 text-white hover:bg-white/10 border-white/15'
                    }`}
                  >
                    {selectedMaterial.locked ? (
                      <>
                        <Lock className="w-4 h-4 text-electric" />
                        <span>Locked Record</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-white/60" />
                        <span>Lock As Authoritative</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onNavigateToConstraints();
                  }}
                  className="w-full py-3 bg-white text-ink hover:bg-paper font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-colors"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Use In Atelier Capsule</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
