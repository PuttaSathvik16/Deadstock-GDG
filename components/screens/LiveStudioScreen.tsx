'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  Users,
  Radio,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Scissors,
  MessageSquare,
  Plus,
  RefreshCw,
  Camera,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lab, Material, Concept, Decision } from '@/types';

interface LiveStudioScreenProps {
  lab: Lab;
  materials: Material[];
  concepts: Concept[];
  decisions: Decision[];
  onAddDecision: (decision: Decision) => void;
  onMutateMaterial: (materialId: string, approved: boolean) => void;
  onNavigateToConcepts: () => void;
}

export const LiveStudioScreen: React.FC<LiveStudioScreenProps> = ({
  lab,
  materials,
  concepts,
  decisions,
  onAddDecision,
  onMutateMaterial,
  onNavigateToConcepts,
}) => {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVonageConnected, setIsVonageConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing studio stream...');
  const [activeTab, setActiveTab] = useState<'materials' | 'look' | 'constraints' | 'decisions'>('materials');

  // Decision composer state
  const [decisionAction, setDecisionAction] = useState<string>('remove_fabric');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[3]?.id || materials[0]?.id || '');
  const [customNote, setCustomNote] = useState<string>('');

  const publisherRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const satinMaterial = materials.find((m) => m.id === 'MAT-004');
  const isSatinQuarantined = satinMaterial && !satinMaterial.approved;

  // Vonage Video Session Connection
  useEffect(() => {
    let localStream: MediaStream | null = null;
    let activeSession: any = null;
    let activePublisher: any = null;

    async function initVonageStudio() {
      try {
        const res = await fetch('/api/credentials');
        const creds = await res.json();

        const OT = (window as any).OT;

        if (OT && creds.sessionId && creds.token) {
          if (typeof OT.setLogLevel === 'function') {
            OT.setLogLevel(OT.ERROR || 3);
          }

          const session = OT.initSession(creds.applicationId, creds.sessionId);
          activeSession = session;

          session.on('streamCreated', (event: any) => {
            const subContainer = document.getElementById('remote-subscribers');
            if (subContainer) {
              const el = document.createElement('div');
              el.className = 'w-full h-full rounded-none overflow-hidden';
              subContainer.appendChild(el);
              session.subscribe(event.stream, el, {
                insertMode: 'append',
                width: '100%',
                height: '100%',
              });
            }
          });

          session.on('sessionDisconnected', () => {
            setIsVonageConnected(false);
            setConnectionStatus('Vonage session disconnected');
          });

          session.connect(creds.token, (err: any) => {
            if (err) {
              console.warn('Vonage session connect fallback:', err.message);
              fallbackLocalStream();
            } else {
              setIsVonageConnected(true);
              setConnectionStatus('Connected to Vonage Video WebRTC');
              if (publisherRef.current) {
                const publisher = OT.initPublisher(
                  publisherRef.current,
                  {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%',
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '1280x720',
                    frameRate: 30,
                    mirror: true,
                    style: { nameDisplayMode: 'on', buttonDisplayMode: 'auto' },
                  },
                  (pubErr: any) => {
                    if (pubErr) {
                      console.warn('OpenTok publisher init error:', pubErr);
                      return;
                    }
                    activePublisher = publisher;
                    session.publish(publisher, (err: any) => {
                      if (err) console.warn('OpenTok publish error:', err);
                    });
                  }
                );
              }
            }
          });
        } else {
          fallbackLocalStream();
        }
      } catch (e: any) {
        console.warn('Using local media stream:', e.message);
        fallbackLocalStream();
      }
    }

    async function fallbackLocalStream() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true,
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
          setIsVonageConnected(true);
          setConnectionStatus('Active Live Studio Camera Feed');
        }
      } catch (mediaErr) {
        setConnectionStatus('Studio Camera Ready (Simulated WebRTC Feed)');
        setIsVonageConnected(true);
      }
    }

    initVonageStudio();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (activePublisher && activeSession) {
        try {
          activeSession.unpublish(activePublisher);
        } catch (e) {
          // ignore
        }
      }
      if (activeSession) {
        try {
          activeSession.disconnect();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handlePostDecision = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMat = materials.find((m) => m.id === selectedMaterialId);

    let resultingChanges = '';
    if (decisionAction === 'remove_fabric') {
      onMutateMaterial(selectedMaterialId, false);
      resultingChanges = `Quarantined ${targetMat?.label || selectedMaterialId} due to atelier shortage. Dependent looks flagged invalid.`;
    } else if (decisionAction === 'restore_fabric') {
      onMutateMaterial(selectedMaterialId, true);
      resultingChanges = `Restored ${targetMat?.label || selectedMaterialId} to verified stock in Supabase.`;
    } else {
      resultingChanges = customNote || 'Creative review consensus logged by Lead Upcycler Sathvik.';
    }

    const newDecision: Decision = {
      id: `DEC-${Date.now()}`,
      speaker_id: 'USR-SATHVIK',
      speaker_name: 'Sathvik (Lead Upcycler)',
      speaker_role: 'Atelier Lead',
      speaker_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: decisionAction === 'remove_fabric' ? 'material_removed' : 'material_locked',
      payload: { material_id: selectedMaterialId, note: customNote },
      resulting_changes: resultingChanges,
    };

    onAddDecision(newDecision);
    setCustomNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header (Section 15: LIVE MATERIAL REVIEW) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>06 // REAL-TIME CO-DESIGN</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">VONAGE WEBRTC SESSION</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-1">
            LIVE MATERIAL REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-1">
            Creative war room: multi-party video co-design paired directly with physical fabric constraints and live AI re-synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow/10 border border-yellow/40 text-yellow rounded-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
            <span>SESSION: 0bad0075...</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 rounded-sm">
            <span>MODERATOR: Sathvik</span>
          </div>
        </div>
      </div>

      {/* War Room Layout: 55% Video Area, 45% Project Context Tabs (Section 15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 55% Video / Collaboration War Room (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="corner-notch relative aspect-[16/10] bg-night border border-white/15 overflow-hidden shadow-2xl">
            {/* Publisher Video Container */}
            <div ref={publisherRef} className="w-full h-full absolute inset-0 z-10" />

            {/* Fallback Local Camera Feed */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover absolute inset-0"
            />

            {/* Simulated Remote Streams Grid */}
            <div id="remote-subscribers" className="absolute top-4 right-4 z-20 w-36 aspect-[4/3] rounded-none border border-white/20 bg-deep/80 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Collaborator"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-night/90 px-1.5 py-0.5 text-[8px] font-mono text-white">
                Elena (Technical Patternist)
              </div>
            </div>

            {/* Overlay Status & Corner Brackets */}
            <div className="absolute inset-4 pointer-events-none z-20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-night/90 border border-white/10 text-[10px] font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
                  <span>VONAGE ROUTED STREAM • 720p HD</span>
                </div>
                <div className="text-[10px] font-mono text-yellow bg-night/90 px-2 py-1 border border-white/10">
                  LEAD: SATHVIK
                </div>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="pointer-events-auto flex items-center justify-between bg-night/90 border border-white/15 p-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className={`p-2 rounded-sm transition-colors ${
                      isAudioMuted ? 'bg-terracotta text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-2 rounded-sm transition-colors ${
                      isVideoMuted ? 'bg-terracotta text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[10px] text-white/50">
                  {connectionStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Section 20: AI Design Assistant Panel */}
          <div className="corner-notch p-6 bg-deep/40 border border-yellow/50 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-yellow font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI DESIGN ASSISTANT (SECTION 20)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-yellow/10 border border-yellow/40 text-yellow text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-ping" />
                <span>LISTENING</span>
              </div>
            </div>

            {/* Current State */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center border-b border-white/10 pb-3">
              <div className="p-2 bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Available</span>
                <span className="text-white font-bold">{materials.filter((m) => m.approved).length} Materials</span>
              </div>
              <div className="p-2 bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Valid</span>
                <span className="text-yellow font-bold">{concepts.filter((c) => !c.affected).length} Feasible</span>
              </div>
              <div className="p-2 bg-night/80 border border-white/10">
                <span className="text-white/40 block text-[9px] uppercase">Revision</span>
                <span className={concepts.some((c) => c.affected) ? 'text-terracotta font-bold' : 'text-white/50'}>
                  {concepts.filter((c) => c.affected).length} Revision
                </span>
              </div>
            </div>

            {/* Recent Decision & Impact */}
            <div className="p-3 bg-night/90 border border-white/10 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-yellow uppercase font-bold">
                <span>RECENT CONSENSUS</span>
                <span>BY SATHVIK (LEAD)</span>
              </div>
              <p className="text-white font-medium">
                {isSatinQuarantined
                  ? '“Quarantine Burgundy Satin due to cutting edge fraying.”'
                  : '“Use denim only for front panels, substituting silk for sleeves.”'}
              </p>
              <div className="text-[11px] text-paper/70 pt-1 border-t border-white/5">
                <strong>IMPACT:</strong> {isSatinQuarantined ? 'LOOK 02 flagged invalid · Requires zone substitution' : 'LOOK 02 & 03 yardage reallocated'}
              </div>
            </div>

            {/* Quick Demo Consensus Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Simulate Studio Discussion Event:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onMutateMaterial('MAT-004', !isSatinQuarantined)}
                  className="px-3 py-1.5 bg-yellow text-ink font-mono font-bold text-[10px] uppercase rounded-sm shadow"
                >
                  {isSatinQuarantined ? 'Restore Burgundy Satin' : '“Remove Burgundy Satin”'}
                </button>
                <button
                  onClick={onNavigateToConcepts}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-[10px] uppercase rounded-sm flex items-center gap-1"
                >
                  <span>Inspect Affected Look</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 45% Project Context Tabs (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tabs Navigation (Section 15) */}
          <div className="flex items-center gap-1 font-mono text-xs bg-deep/40 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-2 text-center uppercase tracking-wider transition-all ${
                activeTab === 'materials'
                  ? 'bg-yellow text-ink font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab('look')}
              className={`flex-1 py-2 text-center uppercase tracking-wider transition-all ${
                activeTab === 'look'
                  ? 'bg-yellow text-ink font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Current Look
            </button>
            <button
              onClick={() => setActiveTab('constraints')}
              className={`flex-1 py-2 text-center uppercase tracking-wider transition-all ${
                activeTab === 'constraints'
                  ? 'bg-yellow text-ink font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Constraints
            </button>
            <button
              onClick={() => setActiveTab('decisions')}
              className={`flex-1 py-2 text-center uppercase tracking-wider transition-all ${
                activeTab === 'decisions'
                  ? 'bg-yellow text-ink font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Decisions ({decisions.length})
            </button>
          </div>

          {/* Tab 1: Materials List */}
          {activeTab === 'materials' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-3">
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider block mb-2">
                VERIFIED LOTS IN ATELIER
              </span>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 border flex items-center justify-between text-xs font-mono transition-all ${
                      m.approved
                        ? 'bg-night border-white/10'
                        : 'bg-terracotta/10 border-terracotta/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: m.visual.swatch_hex }}
                      />
                      <div>
                        <span className="text-white font-bold block">{m.label}</span>
                        <span className="text-white/40 text-[10px]">{m.id} • {m.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={m.approved ? 'text-yellow font-bold block' : 'text-terracotta font-bold block'}>
                        {m.approved ? 'VERIFIED' : 'QUARANTINED'}
                      </span>
                      <span className="text-white/50 text-[10px]">
                        {m.estimate.quantity_estimate.value} {m.estimate.quantity_estimate.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Current Look Focus */}
          {activeTab === 'look' && concepts[0] && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-4">
              <div className="aspect-[4/3] relative overflow-hidden bg-night border border-white/10">
                <img
                  src={concepts[0].visual_uri}
                  alt={concepts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-night/90 px-2 py-0.5 text-xs font-mono text-white font-bold">
                  LOOK 0{concepts[0].look_number}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-white text-lg">{concepts[0].title}</h3>
                <p className="font-mono text-xs text-paper/70 leading-relaxed">{concepts[0].description}</p>
              </div>
              <div className="font-mono text-xs text-white/50 border-t border-white/10 pt-2">
                Uses: <strong className="text-yellow">{concepts[0].uses.join(', ')}</strong>
              </div>
            </div>
          )}

          {/* Tab 3: Constraints */}
          {activeTab === 'constraints' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-3">
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider block mb-2">
                ACTIVE LAB BOUNDARIES
              </span>
              <div className="space-y-2">
                {lab.constraints.map((c) => (
                  <div key={c.id} className="p-3 bg-night border border-white/10 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-yellow font-bold">
                      <span>{c.title}</span>
                      <span className="text-[10px] text-white/40">{c.type}</span>
                    </div>
                    <p className="text-white/60 text-[11px]">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Decisions Activity Rail (Section 16) */}
          {activeTab === 'decisions' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-4">
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider block">
                SIGNED DECISION LEDGER (POSTGRES 17)
              </span>
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {decisions.map((d) => (
                  <div key={d.id} className="p-3 bg-night border border-white/10 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-yellow font-bold">{d.speaker_name}</span>
                      <span className="text-white/40">{d.timestamp}</span>
                    </div>
                    <p className="text-white/80">{d.resulting_changes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision Composer (PRD 12.7) */}
          <form onSubmit={handlePostDecision} className="corner-notch p-6 bg-deep/40 border border-white/15 space-y-4">
            <div className="font-mono text-xs text-yellow font-bold uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Record Collaborative Consensus</span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-white/50 uppercase mb-1">Action Type</label>
                <select
                  value={decisionAction}
                  onChange={(e) => setDecisionAction(e.target.value)}
                  className="w-full px-2.5 py-2 bg-night border border-white/15 text-white focus:outline-none focus:border-yellow"
                >
                  <option value="remove_fabric">Quarantine Fabric Lot</option>
                  <option value="restore_fabric">Restore Fabric Lot</option>
                  <option value="custom_consensus">Discussion Consensus</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-white/50 uppercase mb-1">Target Material</label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full px-2.5 py-2 bg-night border border-white/15 text-white focus:outline-none focus:border-yellow"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id} ({m.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Consensus notes from discussion..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 bg-night border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-yellow"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm shadow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Commit Decision to Postgres</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
