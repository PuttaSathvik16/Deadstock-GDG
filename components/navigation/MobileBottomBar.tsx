'use client';

import React from 'react';
import {
  Sparkles,
  Layers,
  Camera,
  Sliders,
  Video,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ActiveTab } from '../Navbar';

interface MobileBottomBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDisrupted?: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onSelectTab,
  isDisrupted,
}) => {
  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Atelier', icon: Layers },
    { id: 'scan' as ActiveTab, label: 'Scan', icon: Camera },
    { id: 'inventory' as ActiveTab, label: 'Materials', icon: Layers },
    { id: 'constraints' as ActiveTab, label: 'Rules', icon: Sliders },
    { id: 'concepts' as ActiveTab, label: 'Designs', icon: Sparkles, alert: isDisrupted },
    { id: 'studio' as ActiveTab, label: 'Studio', icon: Video, live: true },
    { id: 'sheet' as ActiveTab, label: 'Dossier', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-night/95 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)] px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-sm transition-all ${
                isActive ? 'text-yellow' : 'text-white/50 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-yellow' : ''}`} />
                {tab.alert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terracotta animate-ping" />
                )}
                {tab.live && !tab.alert && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-yellow" />
                )}
              </div>

              <span className={`text-[9px] font-mono uppercase mt-1 tracking-wider ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeMobileIndicator"
                  className="absolute bottom-0 w-6 h-0.5 bg-yellow rounded-full shadow-[0_0_8px_rgba(242,255,85,0.8)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
