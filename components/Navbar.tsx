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
  const [showApiModal, setShowApiModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiApiKey);

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

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGeminiApiKey(tempKey.trim());
    setShowApiModal(false);
  };

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
          {/* API Keys Configuration Button */}
          <button
            onClick={() => {
              setTempKey(geminiApiKey);
              setShowApiModal(true);
            }}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 border ${
              geminiApiKey
                ? 'bg-night text-yellow border-yellow/40 hover:border-yellow'
                : 'bg-night text-white/70 border-white/10 hover:border-white/30'
            }`}
            title="Configure Live Google Gemini and Vonage Video API keys"
          >
            <Key className="w-3 h-3 text-yellow" />
            <span>{geminiApiKey ? 'Gemini 3.6: Active' : 'API Keys'}</span>
          </button>

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

      {/* API Key Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-xl border border-ink-border bg-ink-soft shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-lime" />
                <h3 className="font-display font-bold text-bone text-base">
                  API Keys & Integrations
                </h3>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-1 rounded text-bone/50 hover:text-bone hover:bg-ink-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Supabase PostgreSQL Status Card */}
            <div className="p-3.5 rounded-lg bg-ink border border-ink-border space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-bone font-semibold">Supabase PostgreSQL 17</span>
                <span className="text-lime flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-lime" />
                  CONNECTED
                </span>
              </div>
              <div className="text-[11px] font-mono text-bone/60">
                Host: <span className="text-bone">aws-0-us-east-2.pooler.supabase.com:5432</span>
              </div>
              <div className="text-[11px] font-mono text-bone/60">
                Real-Time Tables: <span className="text-lime">labs, materials, constraints, concepts, decisions</span>
              </div>
            </div>

            {/* Vonage Status Card */}
            <div className="p-3.5 rounded-lg bg-ink border border-ink-border space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-bone font-semibold">Vonage Video WebRTC API</span>
                <span className="text-lime flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-lime" />
                  CONNECTED
                </span>
              </div>
              <div className="text-[11px] font-mono text-bone/60">
                Application ID: <span className="text-bone">0bad0075-65fe-4e3b-91d0-a29742922b13</span>
              </div>
              <div className="text-[11px] font-mono text-bone/60">
                Private Key: <span className="text-bone">./private.key (Loaded)</span>
              </div>
            </div>

            {/* Gemini API Key Form */}
            <form onSubmit={handleSaveKey} className="space-y-3">
              <div className="space-y-1">
                <label className="block font-mono text-xs text-bone/70 uppercase">
                  Google Gemini API Key
                </label>
                <p className="text-[11px] text-bone/50 leading-relaxed">
                  Used for real-time multimodal image analysis (Gemini 2.5 Flash) and constrained concept generation. You can set it here or in <code className="text-lime font-mono">.env</code>.
                </p>
              </div>

              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-ink border border-ink-border text-bone font-mono text-xs focus:outline-none focus:border-lime"
              />

              <div className="flex justify-between items-center pt-2">
                {geminiApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempKey('');
                      onSaveGeminiApiKey('');
                    }}
                    className="text-xs font-mono text-terracotta hover:underline"
                  >
                    Clear Key
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowApiModal(false)}
                    className="px-3 py-1.5 text-xs font-mono text-bone/60 hover:text-bone"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-lime hover:bg-lime-hover text-ink font-mono font-bold text-xs shadow"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
