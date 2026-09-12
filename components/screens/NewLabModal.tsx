'use client';

import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Sliders,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Lab } from '@/types';
import { generateDefaultConstraints } from '@/lib/constraint-engine';
import {
  AUTHENTIC_ATELIER_MATERIALS,
  ACTIVE_CAPSULE_CONCEPTS,
  CO_DESIGN_DECISION_LOG,
} from '@/lib/atelier-inventory';

interface NewLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLab: (lab: Lab, mode: 'scan' | 'upload' | 'archive') => void;
}

export const NewLabModal: React.FC<NewLabModalProps> = ({
  isOpen,
  onClose,
  onCreateLab,
}) => {
  const [method, setMethod] = useState<'scan' | 'upload' | 'archive'>('scan');
  const [name, setName] = useState('Modular Selvedge Upcycling Lab');
  const [brief, setBrief] = useState('3 evening outerwear looks, unisex, strict zero virgin yardage');
  const [audience, setAudience] = useState('Unisex Runway / High Utility');
  const [occasion, setOccasion] = useState('Trans-seasonal Modular Capsule');
  const [targetLooks, setTargetLooks] = useState(3);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLab: Lab = {
      id: `lab-${Date.now()}`,
      name: name.trim() || 'Untitled Deadstock Lab',
      brief: brief.trim() || '3 looks, circular co-design, zero virgin fabric',
      audience,
      occasion,
      target_looks: targetLooks,
      created_at: new Date().toISOString(),
      owner_id: 'designer-current',
      status: method === 'archive' ? 'active_studio' : 'analyzing',
      materials: method === 'archive' ? AUTHENTIC_ATELIER_MATERIALS : [],
      constraints: generateDefaultConstraints(brief, targetLooks),
      concepts: method === 'archive' ? ACTIVE_CAPSULE_CONCEPTS : [],
      decisions: method === 'archive' ? CO_DESIGN_DECISION_LOG : [],
    };

    onCreateLab(newLab, method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-xl border border-ink-border bg-ink-soft shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-border bg-ink">
          <div>
            <div className="font-mono text-xs text-lime uppercase tracking-widest">
              PRD SECTION 12.2 • WORKSPACE SETUP
            </div>
            <h2 className="font-display text-xl font-bold text-bone">
              Create New Deadstock Lab
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-bone/50 hover:text-bone hover:bg-ink-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Method Selector: Live Scan vs Upload vs Surplus Mill Archive */}
          <div>
            <label className="block font-mono text-xs text-bone/70 uppercase mb-2">
              Step 1: Ingestion Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMethod('scan')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  method === 'scan'
                    ? 'border-lime bg-lime/10 text-bone shadow-sm'
                    : 'border-ink-border bg-ink-surface text-bone/60 hover:border-bone/30'
                }`}
              >
                <Camera className={`w-5 h-5 mb-2 ${method === 'scan' ? 'text-lime' : 'text-bone/50'}`} />
                <div className="font-semibold text-sm">Live Camera Scan</div>
                <div className="text-[11px] text-bone/60 mt-0.5">Frame fabric table in real-time</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('upload')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  method === 'upload'
                    ? 'border-cobalt bg-cobalt/10 text-bone shadow-sm'
                    : 'border-ink-border bg-ink-surface text-bone/60 hover:border-bone/30'
                }`}
              >
                <Upload className={`w-5 h-5 mb-2 ${method === 'upload' ? 'text-cobalt' : 'text-bone/50'}`} />
                <div className="font-semibold text-sm">Upload Photos</div>
                <div className="text-[11px] text-bone/60 mt-0.5">Import remnant swatches or roll stills</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('archive')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  method === 'archive'
                    ? 'border-lime bg-lime/10 text-bone shadow-sm'
                    : 'border-ink-border bg-ink-surface text-bone/60 hover:border-bone/30'
                }`}
              >
                <Sparkles className={`w-5 h-5 mb-2 ${method === 'archive' ? 'text-lime' : 'text-bone/50'}`} />
                <div className="font-semibold text-sm">Surplus Mill Archive</div>
                <div className="text-[11px] text-bone/60 mt-0.5">Active 7-fabric verified deadstock lot</div>
              </button>
            </div>
          </div>

          {/* Lab Name */}
          <div>
            <label className="block font-mono text-xs text-bone/70 uppercase mb-1.5">
              Lab / Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Selvedge Atelier Capsule #02"
              className="w-full px-3.5 py-2.5 rounded-lg bg-ink border border-ink-border text-bone text-sm focus:outline-none focus:border-lime transition-colors"
              required
            />
          </div>

          {/* Collection Brief */}
          <div>
            <label className="block font-mono text-xs text-bone/70 uppercase mb-1.5 flex items-center justify-between">
              <span>Collection Brief: What are you trying to make?</span>
              <span className="text-[10px] text-lime lowercase">governs constraint engine</span>
            </label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={2}
              placeholder="e.g. 3 evening outerwear looks, unisex, no new fabric, highlight selvedge ticker"
              className="w-full px-3.5 py-2 rounded-lg bg-ink border border-ink-border text-bone text-sm focus:outline-none focus:border-lime transition-colors resize-none"
              required
            />
          </div>

          {/* Optional Constraints Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] text-bone/60 uppercase mb-1">
                Audience / Silhouettes
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ink border border-ink-border text-bone text-xs focus:outline-none focus:border-lime"
              >
                <option value="Unisex Runway / High Utility">Unisex Runway / High Utility</option>
                <option value="Contemporary Womenswear">Contemporary Womenswear</option>
                <option value="Tailored Menswear Oversize">Tailored Menswear Oversize</option>
                <option value="Avant-Garde Modular">Avant-Garde Modular</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-bone/60 uppercase mb-1">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ink border border-ink-border text-bone text-xs focus:outline-none focus:border-lime"
              >
                <option value="Trans-seasonal Modular Capsule">Trans-seasonal Capsule</option>
                <option value="Eveningwear Gala">Eveningwear Gala</option>
                <option value="Utilitarian Streetwear">Utilitarian Streetwear</option>
                <option value="Exhibition Masterpiece">Exhibition Masterpiece</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-bone/60 uppercase mb-1">
                Target Looks Count
              </label>
              <select
                value={targetLooks}
                onChange={(e) => setTargetLooks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-ink border border-ink-border text-bone text-xs focus:outline-none focus:border-lime"
              >
                <option value={2}>2 Looks</option>
                <option value={3}>3 Looks (Recommended)</option>
                <option value={4}>4 Looks</option>
                <option value={5}>5 Looks</option>
              </select>
            </div>
          </div>
        </form>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink-border bg-ink">
          <div className="text-xs font-mono text-bone/50">
            {method === 'archive' ? 'Loads 7 verified deadstock mill records' : 'Launches real-time camera analyzer'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-bone/60 hover:text-bone transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-md bg-lime hover:bg-lime-hover text-ink font-semibold text-xs font-mono uppercase tracking-wide flex items-center gap-2 shadow-md transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Create Lab & Ingest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
