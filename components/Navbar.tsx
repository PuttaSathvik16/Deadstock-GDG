'use client';

import React, { useState } from 'react';
import {
  Layers,
  Camera,
  Sliders,
  Sparkles,
  Video,
  FileText,
  Plus,
  RotateCcw,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Key,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Lab } from '@/types';

export type ActiveTab = 'landing' | 'overview' | 'scan' | 'inventory' | 'constraints' | 'concepts' | 'studio' | 'sheet';

interface NavbarProps {
  lab: Lab;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewLab: () => void;
  onResetLedger: () => void;
  onTriggerFabricMutation: () => void;
  isFabricMutated: boolean;
  geminiApiKey: string;
  onSaveGeminiApiKey: (key: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lab,
  activeTab,
  onSelectTab,
  onOpenNewLab,
  onResetLedger,
  onTriggerFabricMutation,
  isFabricMutated,
  geminiApiKey,
  onSaveGeminiApiKey,
}) => {
  const approvedCount = lab.materials.filter((m) => m.approved).length;
  const invalidLooksCount = lab.concepts.filter((c) => c.affected).length;

  interface NavItem {
    id: string;
    code: string;
    label: string;
    icon: any;
    desc: string;
    badge?: string;
    live?: boolean;
    alert?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'landing', code: '00', label: 'Manifesto', icon: Sparkles, desc: '5-Beat Narrative Story' },
    { id: 'overview', code: '01', label: 'Overview', icon: Layers, desc: 'Atelier live status' },
    { id: 'scan', code: '02', label: 'Scan', icon: Camera, desc: 'Physical capture reticle' },
    { id: 'inventory', code: '03', label: 'Materials', icon: Layers, badge: `${approvedCount}/${lab.materials.length}`, desc: 'Material library & DNA' },
    { id: 'constraints', code: '04', label: 'Constraints', icon: Sliders, badge: `${lab.constraints.filter(c => c.active).length}`, desc: 'Hard & soft rules' },
    { id: 'concepts', code: '05', label: 'Concepts', icon: Sparkles, badge: `${lab.concepts.length}`, alert: invalidLooksCount > 0, desc: 'Manufacturable capsule' },
    { id: 'studio', code: '06', label: 'Live Studio', icon: Video, live: true, desc: 'Vonage co-design' },
    { id: 'sheet', code: '07', label: 'Tech Pack', icon: FileText, desc: '100% Traceable dossier' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-night/95 backdrop-blur-md">
      {/* Top Banner with Project Context and Live Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2 text-xs border-b border-white/5 bg-deep/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-yellow/10 text-yellow border border-yellow/20 font-mono text-[10px] font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
            LIVE LAB
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-electric/10 text-electric border border-electric/20 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span>POSTGRES 17: SYNCED</span>
          </div>
          <span className="text-white/60 font-mono text-[11px] hidden md:inline">
            WORKSPACE: <strong className="text-white">{lab.name}</strong>
          </span>
          <span className="text-white/30 hidden lg:inline">•</span>
          <span className="text-white/50 truncate max-w-xs lg:max-w-sm hidden lg:inline font-mono text-[11px]">
            LEAD: <strong className="text-yellow">Sathvik</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Causal Mutation Trigger Button */}
          <button
            onClick={onTriggerFabricMutation}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 ${
              isFabricMutated
                ? 'bg-yellow text-ink hover:bg-yellow/90 ring-1 ring-yellow'
                : 'bg-terracotta/90 text-white hover:bg-terracotta ring-1 ring-terracotta'
            }`}
            title="PRD Section 7.3: Remove one fabric live to see causal propagation and zone regeneration"
          >
            {isFabricMutated ? (
              <>
                <RotateCcw className="w-3 h-3" />
                RESTORE BURGUNDY SATIN
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                PURGE SATIN LIVE
              </>
            )}
          </button>

          <button
            onClick={onResetLedger}
            className="px-2 py-1 rounded-sm text-[11px] text-white/50 hover:text-white hover:bg-white/5 font-mono transition-colors"
            title="Reset to verified atelier surplus inventory"
          >
            Reset
          </button>

          <button
            onClick={onOpenNewLab}
            className="px-2.5 py-1 rounded-sm text-[11px] bg-white/5 hover:bg-white/10 text-white font-mono flex items-center gap-1 transition-colors border border-white/10"
          >
            <Plus className="w-3 h-3 text-yellow" />
            New
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('landing' as any)}
          className="cursor-pointer group flex items-center gap-3 mr-4 shrink-0"
        >
          <div className="w-7 h-7 rounded-sm bg-yellow flex items-center justify-center text-ink font-display font-black text-xs tracking-tighter group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(242,255,85,0.4)]">
            DL
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-tight leading-none text-white group-hover:text-yellow transition-colors flex items-center gap-1.5">
              <span>DEADSTOCK</span>
              <span className="text-yellow text-xs font-mono font-normal">// LAB</span>
            </div>
            <div className="text-[9px] font-mono tracking-[0.16em] text-white/40 uppercase mt-0.5">
              Design With What Exists
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Section 34) */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-sm text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap group ${
                  isActive
                    ? 'bg-white text-ink font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`text-[9px] font-mono ${isActive ? 'text-cobalt' : 'text-white/40'}`}>
                  {item.code}
                </span>
                <span className="tracking-wide uppercase text-[11px] font-medium">{item.label}</span>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-xs font-mono text-[9px] ${
                      isActive ? 'bg-ink text-white' : 'bg-white/10 text-white/70 border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.live && (
                  <span className="flex items-center gap-1 px-1 py-0.5 rounded-xs bg-yellow/20 text-yellow font-mono text-[8px] font-bold">
                    <Radio className="w-2 h-2 animate-pulse" />
                    LIVE
                  </span>
                )}

                {item.alert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
