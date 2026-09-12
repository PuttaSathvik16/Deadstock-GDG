'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Layers,
  Camera,
  Sliders,
  Sparkles,
  Video,
  FileText,
  AlertTriangle,
  RotateCcw,
  Key,
  X,
  Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from '../Navbar';
import { Material } from '@/types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  materials: Material[];
  onTriggerDisruption: () => void;
  isFabricDisrupted: boolean;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  materials,
  onTriggerDisruption,
  isFabricDisrupted,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredMaterials = materials.filter(
    (m) =>
      m.id.toLowerCase().includes(query.toLowerCase()) ||
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    {
      id: 'landing',
      label: '00 // Manifesto (5-Beat Story)',
      action: () => {
        onNavigateTab('landing');
        onClose();
      },
      icon: Sparkles,
    },
    {
      id: 'overview',
      label: '01 // Atelier Overview',
      action: () => {
        onNavigateTab('overview');
        onClose();
      },
      icon: Layers,
    },
    {
      id: 'scan',
      label: '02 // Live Material Scanner',
      action: () => {
        onNavigateTab('scan');
        onClose();
      },
      icon: Camera,
    },
    {
      id: 'inventory',
      label: '03 // Material Library Archive',
      action: () => {
        onNavigateTab('inventory');
        onClose();
      },
      icon: Layers,
    },
    {
      id: 'constraints',
      label: '04 // Constraint Builder',
      action: () => {
        onNavigateTab('constraints');
        onClose();
      },
      icon: Sliders,
    },
    {
      id: 'concepts',
      label: '05 // Capsule Concepts Reel',
      action: () => {
        onNavigateTab('concepts');
        onClose();
      },
      icon: Sparkles,
    },
    {
      id: 'studio',
      label: '06 // Vonage Live Studio War Room',
      action: () => {
        onNavigateTab('studio');
        onClose();
      },
      icon: Video,
    },
    {
      id: 'sheet',
      label: '07 // Manufacturing Tech Pack & Spec',
      action: () => {
        onNavigateTab('sheet');
        onClose();
      },
      icon: FileText,
    },
    {
      id: 'disruption',
      label: isFabricDisrupted
        ? '⚡ Live Disruption: Restore Burgundy Satin'
        : '⚡ Live Disruption: Purge Burgundy Satin (MAT-004)',
      action: () => {
        onTriggerDisruption();
        onClose();
      },
      icon: AlertTriangle,
      alert: true,
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-night/80 backdrop-blur-md"
        />

        {/* Modal Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="corner-notch relative w-full max-w-xl bg-night border border-white/20 shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-deep/40">
            <Search className="w-4 h-4 text-yellow" />
            <input
              type="text"
              autoFocus
              placeholder="Type a screen, material (e.g. denim), or action..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-white/40"
            />
            <kbd className="px-2 py-0.5 rounded-sm bg-white/10 text-white/50 text-[10px] font-mono">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2 space-y-4 font-mono text-xs">
            {/* Quick Actions & Navigation */}
            <div className="space-y-1">
              <div className="text-[10px] text-white/40 uppercase tracking-wider px-2 py-1">
                Navigation & Atelier Controls
              </div>
              {filteredActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-left transition-colors ${
                      item.alert
                        ? 'hover:bg-terracotta/20 text-terracotta'
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-yellow" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-white/40">JUMP ↵</span>
                  </button>
                );
              })}
            </div>

            {/* Matching Physical Remnants */}
            {filteredMaterials.length > 0 && (
              <div className="space-y-1 border-t border-white/10 pt-2">
                <div className="text-[10px] text-white/40 uppercase tracking-wider px-2 py-1">
                  Surplus Lots in Supabase
                </div>
                {filteredMaterials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      onNavigateTab('inventory');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-sm hover:bg-white/10 text-left transition-colors text-white/80 hover:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white/30"
                        style={{ backgroundColor: mat.visual.swatch_hex }}
                      />
                      <span className="font-bold text-yellow">{mat.id}</span>
                      <span className="truncate">{mat.label}</span>
                    </div>
                    <span className="text-[10px] text-white/50">
                      {mat.estimate.quantity_estimate.value} {mat.estimate.quantity_estimate.unit}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
