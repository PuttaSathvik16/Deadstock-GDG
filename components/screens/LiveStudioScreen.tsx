'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
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
  Volume2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Info,
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
  onRegenerateLook?: (lookId: string) => Promise<void>;
  isGenerating?: boolean;
  onNavigateToConcepts: () => void;
}

interface DiscussionCue {
  id: string;
  speaker: string;
  role: string;
  avatar: string;
  quote: string;
  actionType: 'remove_fabric' | 'reallocate' | 'restore_fabric' | 'custom_consensus';
  targetMaterialId: string;
  note: string;
  aiImpact: string;
}

export const LiveStudioScreen: React.FC<LiveStudioScreenProps> = ({
  lab,
  materials,
  concepts,
  decisions,
  onAddDecision,
  onMutateMaterial,
  onRegenerateLook,
  isGenerating = false,
  onNavigateToConcepts,
}) => {
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVonageConnected, setIsVonageConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing studio stream...');
  const [activeTab, setActiveTab] = useState<'materials' | 'look' | 'constraints' | 'decisions'>('materials');
  const [selectedLookIndex, setSelectedLookIndex] = useState<number>(0);
  const [showStudioGuide, setShowStudioGuide] = useState(true);

  // Decision composer state
  const [decisionAction, setDecisionAction] = useState<string>('remove_fabric');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[3]?.id || materials[0]?.id || '');
  const [customNote, setCustomNote] = useState<string>('');
  const [isCommitting, setIsCommitting] = useState(false);

  // AI Pending Proposal State (Section 20: [ APPLY ] [ DISMISS ])
  const [pendingProposal, setPendingProposal] = useState<{
    id: string;
    title: string;
    decisionText: string;
    speaker: string;
    targetLookId: string;
    impactText: string;
    applied: boolean;
  } | null>(null);

  const publisherRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const satinMaterial = materials.find((m) => m.id === 'MAT-004');
  const isSatinQuarantined = satinMaterial && !satinMaterial.approved;
  const affectedConcepts = concepts.filter((c) => c.affected);

  // Discussion cues for video war room simulation
  const discussionCues: DiscussionCue[] = [
    {
      id: 'cue-1',
      speaker: 'Elena Ramos',
      role: 'Technical Patternist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      quote: '“Sathvik, we only have 0.9m of Burgundy Satin left. We cannot cut the full sleeves for Look 02 without edge fraying.”',
      actionType: 'remove_fabric',
      targetMaterialId: 'MAT-004',
      note: 'Quarantine Burgundy Satin scrap due to yardage shortage for Look 02 sleeves.',
      aiImpact: 'LOOK 02 flagged invalid · Gemini recommends substituting MAT-002 (Mulberry Raw Silk Organza) for sleeves.',
    },
    {
      id: 'cue-2',
      speaker: 'Elena Ramos',
      role: 'Technical Patternist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      quote: '“We do not have enough denim for the entire jacket body and sleeves. Let us use denim only for front panels.”',
      actionType: 'reallocate',
      targetMaterialId: 'MAT-001',
      note: 'Use denim only on front panels, reallocating remaining yardage across looks.',
      aiImpact: 'LOOK 02 updated: 1.2m denim saved. Silk organza assigned to sleeves. Feasibility: 100%.',
    },
    {
      id: 'cue-3',
      speaker: 'Marcus Vance',
      role: 'Sustainability Auditor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      quote: '“If we substitute Mulberry Raw Silk for Look 02, our deadstock utilization stays above 85% with zero waste.”',
      actionType: 'custom_consensus',
      targetMaterialId: 'MAT-002',
      note: 'Substitute Mulberry Raw Silk for Look 02 sleeves to maintain 85%+ utilization.',
      aiImpact: 'Collection utilization validated at 87%. Zero virgin synthetic impact maintained.',
    },
  ];

  // Set default pending proposal if Look 02 is affected
  useEffect(() => {
    if (isSatinQuarantined && !pendingProposal) {
      setPendingProposal({
        id: 'prop-satin',
        title: 'Sleeve Zone Material Substitution',
        decisionText: '“Quarantine Burgundy Satin; substitute Mulberry Raw Silk for Look 02 sleeves.”',
        speaker: 'Sathvik (Lead Upcycler)',
        targetLookId: 'LOOK-02',
        impactText: 'LOOK 02 updated: 0.9m satin removed. Sleeve panels remapped to MAT-002 (Mulberry Raw Silk). Feasibility restored.',
        applied: false,
      });
    } else if (!isSatinQuarantined && !pendingProposal) {
      setPendingProposal({
        id: 'prop-denim',
        title: 'Front Panel Yardage Allocation',
        decisionText: '“Use denim only for front panels, substituting silk for sleeves.”',
        speaker: 'Sathvik (Lead Upcycler)',
        targetLookId: 'LOOK-02',
        impactText: 'LOOK 02 & 03 yardage reallocated: 1.2m denim conserved for body panels.',
        applied: false,
      });
    }
  }, [isSatinQuarantined]);

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
        } catch (e) {}
      }
      if (activeSession) {
        try {
          activeSession.disconnect();
        } catch (e) {}
      }
    };
  }, []);

  // Handle Capture Discussion Cue into Decision Composer
  const handleCaptureCue = (cue: DiscussionCue) => {
    setSelectedMaterialId(cue.targetMaterialId);
    setDecisionAction(cue.actionType === 'reallocate' ? 'custom_consensus' : cue.actionType);
    setCustomNote(cue.note);

    setPendingProposal({
      id: `prop-${Date.now()}`,
      title: cue.actionType === 'remove_fabric' ? 'Quarantine & Re-synthesize' : 'Discussion Consensus Action',
      decisionText: cue.quote,
      speaker: cue.speaker,
      targetLookId: 'LOOK-02',
      impactText: cue.aiImpact,
      applied: false,
    });
  };

  // Post Decision to Supabase PostgreSQL & apply material changes
  const handlePostDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCommitting(true);

    const targetMat = materials.find((m) => m.id === selectedMaterialId);
    let resultingChanges = '';

    if (decisionAction === 'remove_fabric') {
      onMutateMaterial(selectedMaterialId, false);
      resultingChanges = `Quarantined ${targetMat?.label || selectedMaterialId} due to atelier shortage. Dependent looks flagged for revision.`;
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
      event_type: decisionAction === 'remove_fabric' ? 'material_removed' : decisionAction === 'restore_fabric' ? 'material_restored' : 'consensus_logged',
      payload: { material_id: selectedMaterialId, note: customNote },
      resulting_changes: resultingChanges,
    };

    onAddDecision(newDecision);

    // Update pending proposal for AI panel
    setPendingProposal({
      id: `prop-${Date.now()}`,
      title: decisionAction === 'remove_fabric' ? 'Material Quarantine' : 'Atelier Consensus',
      decisionText: customNote ? `“${customNote}”` : resultingChanges,
      speaker: 'Sathvik (Lead Upcycler)',
      targetLookId: 'LOOK-02',
      impactText: decisionAction === 'remove_fabric'
        ? `LOOK 02 flagged invalid (needs replacement for ${targetMat?.label || selectedMaterialId}). Click [APPLY TO LOOK] to trigger Gemini re-synthesis.`
        : `Consensus recorded to Postgres ledger. Ready to apply to collection.`,
      applied: false,
    });

    setCustomNote('');
    setTimeout(() => setIsCommitting(false), 400);
  };

  // Section 20 Hero: Apply AI Proposal to the project
  const handleApplyProposal = async () => {
    if (!pendingProposal) return;

    if (onRegenerateLook) {
      await onRegenerateLook('LOOK-02');
    }

    setPendingProposal((prev) =>
      prev ? { ...prev, applied: true, impactText: '✓ DESIGN VALIDATED & COMMITTED TO SUPABASE. Look 02 feasible.' } : null
    );
  };

  const handleDismissProposal = () => {
    setPendingProposal(null);
  };

  // Current active look for Tab 2
  const currentConcept = concepts[selectedLookIndex] || concepts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>06 // REAL-TIME CO-DESIGN</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">VONAGE WEBRTC WAR ROOM</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-1">
            LIVE MATERIAL REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-1">
            Multi-party atelier co-design: speech discussion turns into structured decisions, and Gemini immediately re-synthesizes feasible garment cuts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow/10 border border-yellow/40 text-yellow rounded-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
            <span>SESSION: ENCRYPTED WEBRTC</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 rounded-sm">
            <span>MODERATOR: Sathvik (Lead)</span>
          </div>
          <button
            onClick={() => setShowStudioGuide(!showStudioGuide)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-sm transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-yellow" />
            <span>{showStudioGuide ? 'Hide Guide' : 'How Studio Works'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Workflow Guide Banner */}
      <AnimatePresence>
        {showStudioGuide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="corner-notch p-4 bg-deep/60 border border-yellow/40 text-white font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-yellow font-bold uppercase tracking-wider text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  HOW THE LIVE STUDIO WORKS (THE 4-STEP COLLABORATION LOOP)
                </span>
                <button onClick={() => setShowStudioGuide(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-paper/80 pt-1">
                <div className="p-2.5 bg-night/80 border border-white/10">
                  <span className="text-yellow font-bold block mb-1">1. LIVE ATELIER VIDEO</span>
                  Watch Elena and Sathvik collaborate via Vonage WebRTC stream. Audio and mic controls are active.
                </div>
                <div className="p-2.5 bg-night/80 border border-white/10">
                  <span className="text-yellow font-bold block mb-1">2. CAPTURE DISCUSSION</span>
                  Click <strong className="text-yellow">[+ Capture Decision]</strong> on team quotes below the video to log physical constraints.
                </div>
                <div className="p-2.5 bg-night/80 border border-white/10">
                  <span className="text-yellow font-bold block mb-1">3. AI DESIGN ASSISTANT</span>
                  Gemini listens and models the impact on Look 01, 02, and 03 without sending 45 minutes of raw audio.
                </div>
                <div className="p-2.5 bg-night/80 border border-yellow/40">
                  <span className="text-yellow font-bold block mb-1">4. CLICK [APPLY TO LOOK]</span>
                  Hit the glowing yellow <strong className="text-yellow">[APPLY TO LOOK]</strong> button to regenerate the affected garment zones live!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* War Room Layout: 55% Video Area, 45% Project Context Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 55% Video / Collaboration War Room (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Video Container */}
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

            {/* Collaborators Floating Overlay Grid */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              {/* Elena Tile */}
              <div className="w-36 aspect-[4/3] rounded-none border border-white/20 bg-deep/80 overflow-hidden shadow-lg relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Elena Ramos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 flex items-center gap-1 bg-night/90 px-1 py-0.5 text-[8px] font-mono text-yellow font-bold">
                  <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                  <span>SPEAKING</span>
                </div>
                <div className="absolute bottom-1 left-1 bg-night/90 px-1.5 py-0.5 text-[8px] font-mono text-white">
                  Elena (Technical Patternist)
                </div>
              </div>

              {/* Marcus Tile */}
              <div className="w-36 aspect-[4/3] rounded-none border border-white/20 bg-deep/80 overflow-hidden shadow-lg relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  alt="Marcus Vance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1 bg-night/90 px-1.5 py-0.5 text-[8px] font-mono text-white">
                  Marcus (Sustainability Auditor)
                </div>
              </div>
            </div>

            {/* Overlay Status & Corner Brackets */}
            <div className="absolute inset-4 pointer-events-none z-20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-night/90 border border-white/10 text-[10px] font-mono text-white">
                  <span className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
                  <span>VONAGE ROUTED STREAM • 720p HD</span>
                </div>
                <div className="text-[10px] font-mono text-yellow bg-night/90 px-2 py-1 border border-white/10 font-bold">
                  MODERATOR: SATHVIK (LEAD)
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
                    title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-2 rounded-sm transition-colors ${
                      isVideoMuted ? 'bg-terracotta text-white' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={isVideoMuted ? 'Start Camera' : 'Stop Camera'}
                  >
                    {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                  <div className="text-[10px] text-white/60 pl-2 hidden sm:block">
                    {connectionStatus}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                  <span className="text-[10px] font-bold text-lime">3 ATELIER PARTICIPANTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Atelier Discussion & Audio Stream (Section 18 & 19) */}
          <div className="corner-notch p-5 bg-deep/30 border border-white/15 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 font-mono text-xs text-yellow font-bold uppercase tracking-wider">
                <Volume2 className="w-4 h-4" />
                <span>Live Atelier Discussion & Audio Cues</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase">Click quote to capture</span>
            </div>

            <div className="space-y-2.5">
              {discussionCues.map((cue) => (
                <div
                  key={cue.id}
                  className="p-3 bg-night/80 border border-white/10 hover:border-yellow/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={cue.avatar}
                      alt={cue.speaker}
                      className="w-8 h-8 rounded-full border border-white/20 object-cover shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <strong className="text-white">{cue.speaker}</strong>
                        <span className="text-white/40">({cue.role})</span>
                      </div>
                      <p className="font-mono text-xs text-paper/90 italic mt-0.5">{cue.quote}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCaptureCue(cue)}
                    className="shrink-0 px-3 py-1.5 bg-yellow/10 hover:bg-yellow text-yellow hover:text-ink border border-yellow/40 text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 rounded-xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Capture Decision</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 20 Hero Feature: AI Design Assistant Panel */}
          <div className="corner-notch p-6 bg-deep/40 border border-yellow/50 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-yellow font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI DESIGN ASSISTANT • REAL-TIME COPILOT</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-yellow/10 border border-yellow/40 text-yellow text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-ping" />
                <span>LISTENING (GEMINI 3.6 FLASH)</span>
              </div>
            </div>

            {/* Current State Counters */}
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
                <span className={affectedConcepts.length > 0 ? 'text-terracotta font-bold animate-pulse' : 'text-white/50'}>
                  {affectedConcepts.length} Needs Revision
                </span>
              </div>
            </div>

            {/* Proposed Decision & AI Impact Card (Section 18 & 20) */}
            {pendingProposal && (
              <div className="p-4 bg-night/95 border border-yellow/30 space-y-3 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between text-[10px] text-yellow uppercase font-bold border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{pendingProposal.title}</span>
                  </div>
                  <span className="text-white/60">APPROVED BY: {pendingProposal.speaker}</span>
                </div>

                <div>
                  <span className="text-white/50 text-[10px] uppercase block">Consensus Proposal:</span>
                  <p className="text-white font-bold text-xs mt-0.5">{pendingProposal.decisionText}</p>
                </div>

                <div className="p-2.5 bg-deep/60 border border-white/10 text-[11px] text-paper/90 space-y-1">
                  <strong className="text-yellow uppercase text-[10px] block">AI Impact Analysis:</strong>
                  <p>{pendingProposal.impactText}</p>
                </div>

                {/* Section 20 Hero Buttons: [ APPLY ] [ DISMISS ] */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleApplyProposal}
                    disabled={isGenerating || pendingProposal.applied}
                    className={`flex-1 py-2.5 px-4 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow transition-all ${
                      pendingProposal.applied
                        ? 'bg-lime text-ink'
                        : 'bg-yellow hover:bg-yellow/90 text-ink shadow-[0_0_15px_rgba(242,255,85,0.4)]'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Gemini Synthesizing...</span>
                      </>
                    ) : pendingProposal.applied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied to Collection ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>[ Apply to Look ]</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDismissProposal}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 hover:text-white font-mono text-xs uppercase rounded-xs transition-all"
                  >
                    [ Dismiss ]
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Controls */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Instant Studio Disruption Triggers:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onMutateMaterial('MAT-004', !isSatinQuarantined)}
                  className={`px-3 py-1.5 font-mono font-bold text-[10px] uppercase rounded-xs transition-all ${
                    isSatinQuarantined
                      ? 'bg-lime text-ink'
                      : 'bg-terracotta text-white shadow-[0_0_10px_rgba(255,100,80,0.3)]'
                  }`}
                >
                  {isSatinQuarantined ? '✓ Restore Burgundy Satin' : '⚠ Quarantine Burgundy Satin'}
                </button>
                <button
                  onClick={onNavigateToConcepts}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-[10px] uppercase rounded-xs flex items-center gap-1"
                >
                  <span>Jump to Concept Studio</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 45% Project Context Tabs (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Context Tab Navigation */}
          <div className="flex items-center gap-1 font-mono text-xs bg-deep/40 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-2 text-center uppercase tracking-wider transition-all ${
                activeTab === 'materials'
                  ? 'bg-yellow text-ink font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Materials ({materials.length})
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

          {/* Tab 1: Materials List with 1-Click Quarantine / Restore */}
          {activeTab === 'materials' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  VERIFIED LOTS IN ATELIER
                </span>
                <span className="font-mono text-[10px] text-yellow">Click row to select target</span>
              </div>
              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                {materials.map((m, idx) => {
                  const isSelected = selectedMaterialId === m.id;
                  return (
                    <div
                      key={`${m.id}-${idx}`}
                      onClick={() => setSelectedMaterialId(m.id)}
                      className={`p-3 border flex items-center justify-between text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'border-yellow bg-yellow/5'
                          : m.approved
                          ? 'bg-night border-white/10 hover:border-white/30'
                          : 'bg-terracotta/10 border-terracotta/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: m.visual.swatch_hex }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold block">{m.label}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-yellow text-ink px-1 font-bold">SELECTED</span>
                            )}
                          </div>
                          <span className="text-white/40 text-[10px]">
                            {m.id} • {m.category} • {m.estimate.quantity_estimate.value} {m.estimate.quantity_estimate.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMutateMaterial(m.id, !m.approved);
                          }}
                          className={`px-2 py-1 text-[9px] uppercase font-bold rounded-xs transition-all ${
                            m.approved
                              ? 'bg-white/10 hover:bg-terracotta text-white/70 hover:text-white'
                              : 'bg-lime text-ink'
                          }`}
                        >
                          {m.approved ? 'Quarantine' : 'Restore'}
                        </button>
                        <span className={m.approved ? 'text-yellow font-bold text-[10px]' : 'text-terracotta font-bold text-[10px]'}>
                          {m.approved ? 'VERIFIED' : 'QUARANTINED'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Current Look Focus with Selector & Material Trace */}
          {activeTab === 'look' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-4">
              {/* Look Selector Bar */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] text-white/40 uppercase">Select Look:</span>
                <div className="flex items-center gap-1.5">
                  {concepts.map((concept, idx) => (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedLookIndex(idx)}
                      className={`px-3 py-1 font-mono text-xs uppercase font-bold transition-all ${
                        selectedLookIndex === idx
                          ? 'bg-yellow text-ink'
                          : concept.affected
                          ? 'bg-terracotta/20 text-terracotta border border-terracotta/40'
                          : 'bg-white/5 text-white/70 hover:text-white'
                      }`}
                    >
                      Look 0{concept.look_number} {concept.affected && '⚠'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Look Visual Plate */}
              <div className="aspect-[4/3] relative overflow-hidden bg-night border border-white/10">
                <img
                  src={currentConcept.visual_uri}
                  alt={currentConcept.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-night/90 px-2 py-0.5 text-xs font-mono text-white font-bold">
                  LOOK 0{currentConcept.look_number}
                </div>
                <div
                  className={`absolute top-2 right-2 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                    currentConcept.affected
                      ? 'bg-terracotta text-white'
                      : 'bg-lime text-ink'
                  }`}
                >
                  {currentConcept.affected ? '⚠ MATERIAL CONFLICT' : '✓ 100% FEASIBLE'}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-display font-bold text-white text-lg">{currentConcept.title}</h3>
                <p className="font-mono text-xs text-paper/70 leading-relaxed">{currentConcept.description}</p>
              </div>

              {/* Material Trace Breakdown (Section 12 & 16) */}
              <div className="p-3 bg-night border border-white/10 space-y-2 font-mono text-xs">
                <span className="text-yellow text-[10px] font-bold uppercase block">
                  MATERIAL TRACE BREAKDOWN
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-white/80">
                    <span>Front & Body Panels:</span>
                    <strong className="text-yellow">MAT-001 (Raw Indigo Denim) ✓</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Sleeve & Hem Trim:</span>
                    {currentConcept.affected ? (
                      <strong className="text-terracotta flex items-center gap-1">
                        <span>MAT-004 (Burgundy Satin)</span>
                        <span>❌ SHORTAGE</span>
                      </strong>
                    ) : (
                      <strong className="text-yellow flex items-center gap-1">
                        <span>MAT-002 (Mulberry Raw Silk)</span>
                        <span>✓</span>
                      </strong>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>Collar & Closure:</span>
                    <strong className="text-yellow">MAT-007 (Charcoal Wool) ✓</strong>
                  </div>
                </div>

                {currentConcept.affected && onRegenerateLook && (
                  <button
                    onClick={() => onRegenerateLook(currentConcept.id)}
                    disabled={isGenerating}
                    className="w-full mt-2 py-2 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 rounded-xs shadow"
                  >
                    {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Scissors className="w-3.5 h-3.5" />}
                    <span>Regenerate Look 0{currentConcept.look_number} with AI</span>
                  </button>
                )}
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

          {/* Tab 4: Decisions Activity Rail */}
          {activeTab === 'decisions' && (
            <div className="corner-notch p-6 bg-deep/30 border border-white/10 space-y-4">
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider block">
                SIGNED DECISION LEDGER (POSTGRES 17)
              </span>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
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

          {/* Decision Composer (Section 18 & PRD 12.7) */}
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
                  {materials.map((m, idx) => (
                    <option key={`${m.id}-${idx}`} value={m.id}>
                      {m.id} ({m.label}) {m.approved ? '' : '• QUARANTINED'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-white/50 uppercase mb-1">Consensus Note / Team Quote</label>
              <input
                type="text"
                placeholder="e.g. Use denim only for front panels, substitute silk for sleeves..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 bg-night border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={isCommitting}
              className="w-full py-2.5 bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs shadow transition-all"
            >
              {isCommitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording to Supabase...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit Decision to Postgres</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
