'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  Sparkles,
  Layers,
  Check,
  Upload,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Material } from '@/types';
import { MaterialDNA } from '../editorial/MaterialDNA';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface LiveScanScreenProps {
  onMaterialsDetected: (newMaterials: Material[]) => void;
  onNavigateToInventory: () => void;
  existingMaterialsCount: number;
}

const REAL_DEADSTOCK_FABRIC_FEEDS = [
  {
    name: 'Denim & Wool Trim Tabletop',
    url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=80',
    description: 'Raw indigo roll + charcoal knit scrap',
  },
  {
    name: 'Corduroy & Silk Scrap Remnants',
    url: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=1000&q=80',
    description: '8-wale terracotta corduroy + duchesse offcuts',
  },
  {
    name: 'Weathered Canvas & Brass Hardware',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    description: 'Olive military canvas + #10 separating brass teeth',
  },
];

export const LiveScanScreen: React.FC<LiveScanScreenProps> = ({
  onMaterialsDetected,
  onNavigateToInventory,
  existingMaterialsCount,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progressStage, setProgressStage] = useState<'idle' | 'analyzing' | 'extracting' | 'organizing' | 'ready'>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [liveDetections, setLiveDetections] = useState<Material[]>([]);

  // Start WebRTC camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCamera(true);
            setCameraError(null);
          }
        } else {
          setCameraError('Camera API not accessible in this context. Use studio preset or upload.');
        }
      } catch (err: any) {
        console.warn('Camera access error:', err.message);
        setCameraError('Camera preview inactive. You can use authentic mill presets or upload photos.');
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle capture from live video feed
  const handleCaptureFrame = async () => {
    let imagePayload = '';

    if (videoRef.current && canvasRef.current && hasCamera) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        imagePayload = canvas.toDataURL('image/jpeg', 0.85);
      }
    } else {
      imagePayload = REAL_DEADSTOCK_FABRIC_FEEDS[0].url;
    }

    setCapturedImage(imagePayload);
    await processImageThroughGemini(imagePayload);
  };

  // Handle image upload from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result as string;
      setCapturedImage(b64);
      await processImageThroughGemini(b64);
    };
    reader.readAsDataURL(file);
  };

  // Process via /api/scan endpoint
  const processImageThroughGemini = async (imageData: string) => {
    setIsScanning(true);
    setProgressStage('analyzing');

    try {
      setTimeout(() => setProgressStage('extracting'), 600);
      setTimeout(() => setProgressStage('organizing'), 1200);

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          existingCount: existingMaterialsCount,
        }),
      });

      const data = await res.json();
      setProgressStage('ready');

      if (data.materials && Array.isArray(data.materials)) {
        setLiveDetections(data.materials);
        onMaterialsDetected(data.materials);
      }
    } catch (err: any) {
      console.error('Scan failed:', err);
      setProgressStage('idle');
    } finally {
      setIsScanning(false);
    }
  };

  const handleToggleApproveDetection = (id: string) => {
    setLiveDetections((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              approved: !m.approved,
              verification: !m.approved ? 'verified' : 'needs_review',
            }
          : m
      )
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-76px)] w-full flex flex-col bg-night text-bone overflow-hidden select-none">
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Screen Header (Section 9) */}
      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-ink-soft/90">
        <div>
          <div className="font-mono text-[10px] text-yellow uppercase tracking-widest">
            MATERIAL ACQUISITION
          </div>
          <h1 className="font-display font-black text-2xl text-bone tracking-tight">
            SCAN THE MATERIAL.
          </h1>
          <p className="text-xs text-bone/60 font-light mt-0.5">
            Show us what exists. The lab will do the rest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ConstraintBadge label="AUTONOMOUS DETECTION" variant="active" showLock={false} />
          <button
            onClick={onNavigateToInventory}
            className="px-4 py-2 rounded-[2px] bg-ink-surface hover:bg-white/10 border border-white/15 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Review Ledger ({existingMaterialsCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-yellow" />
          </button>
        </div>
      </div>

      {/* Main Studio Viewport & Right Live Detections Rail */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Main Camera Viewport (8 Columns) */}
        <div className="lg:col-span-8 relative flex items-center justify-center overflow-hidden bg-black/40 border-r border-white/10">
          {/* Camera Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              hasCamera && !capturedImage ? 'opacity-90' : 'opacity-0'
            }`}
          />

          {/* Frozen Frame / Sample Imagery */}
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Fabric Scene"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : !hasCamera ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <img
                src={REAL_DEADSTOCK_FABRIC_FEEDS[0].url}
                alt="Studio Tabletop Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[1px]"
              />
              <div className="relative z-10 max-w-md p-6 rounded-[4px] bg-ink/90 border border-white/15 space-y-4 shadow-2xl corner-notch">
                <div className="w-12 h-12 rounded-[2px] bg-yellow/10 border border-yellow/40 text-yellow flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-bone">
                  Live Studio Ingestion
                </h3>
                <p className="text-xs text-bone/70 leading-relaxed font-sans">
                  {cameraError || 'Position physical deadstock bolts, cutting table offcuts, or trims before your camera.'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-2 font-mono text-xs">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-[2px] bg-ink-surface hover:bg-white/10 border border-white/15 text-bone flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-cobalt-electric" />
                    Upload Photo
                  </button>
                  <button
                    onClick={handleCaptureFrame}
                    className="px-4 py-2 rounded-[2px] bg-yellow text-ink font-bold flex items-center gap-1.5 shadow"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Inspect Active Lot
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Technical Corner Brackets & Reticle (Section 9) */}
          <div className="absolute inset-6 sm:inset-12 pointer-events-none border border-white/15 flex flex-col justify-between p-4">
            <div className="animate-scanline" />

            {/* Top Corners */}
            <div className="flex justify-between">
              <div className="w-7 h-7 border-t-2 border-l-2 border-yellow" />
              <div className="w-7 h-7 border-t-2 border-r-2 border-yellow" />
            </div>

            {/* Center Status Pill */}
            <div className="self-center flex items-center gap-2 bg-ink/80 px-4 py-1.5 rounded-[2px] border border-white/15 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
              <span className="font-mono text-[11px] text-bone tracking-wider uppercase">
                {isScanning
                  ? progressStage === 'analyzing'
                    ? '1. Reading material surface...'
                    : progressStage === 'extracting'
                    ? '2. Extracting weave & texture cues...'
                    : progressStage === 'organizing'
                    ? '3. Assigning confidence ratings...'
                    : 'Ready'
                  : 'Target Cutting Table Remnants'}
              </span>
            </div>

            {/* Bottom Corners */}
            <div className="flex justify-between">
              <div className="w-7 h-7 border-b-2 border-l-2 border-yellow" />
              <div className="w-7 h-7 border-b-2 border-r-2 border-yellow" />
            </div>
          </div>
        </div>

        {/* Right Rail: LIVE DETECTIONS (4 Columns) (Section 9) */}
        <div className="lg:col-span-4 bg-ink-soft p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-2">
              <span className="text-bone font-bold tracking-wider uppercase">
                Live Detections ({liveDetections.length})
              </span>
              <span className="text-yellow text-[11px]">
                {liveDetections.filter((m) => m.approved).length} VERIFIED
              </span>
            </div>

            {liveDetections.length === 0 ? (
              <div className="p-6 rounded-[2px] border border-dashed border-white/15 text-center space-y-2">
                <Eye className="w-6 h-6 text-bone/40 mx-auto" />
                <div className="font-mono text-xs text-bone/70 uppercase">No materials parsed yet</div>
                <p className="text-[11px] text-bone/50 font-light">
                  Align fabric rolls in the viewport and click "Freeze & Analyze Frame" to extract structured records.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {liveDetections.map((mat) => (
                  <div
                    key={mat.id}
                    className={`p-3 rounded-[2px] border transition-all font-mono text-xs ${
                      mat.approved
                        ? 'bg-ink-surface border-yellow/50 shadow-sm'
                        : 'bg-ink border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-yellow font-bold">{mat.id}</span>
                          <span className="text-bone/40">•</span>
                          <span className="uppercase text-bone/60">{mat.category}</span>
                        </div>
                        <div className="font-semibold text-bone text-sm truncate mt-0.5">
                          {mat.label}
                        </div>
                        <div className="text-[11px] text-bone/60 mt-1 font-sans italic">
                          "{mat.properties?.stretch_guess}"
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-yellow font-bold">
                          {Math.round((mat.confidence || 0.9) * 100)}% CONF
                        </div>
                        <div className="text-[10px] text-bone/50 mt-0.5">
                          {mat.estimate?.quantity_estimate?.value} {mat.estimate?.quantity_estimate?.unit}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-bone/50 uppercase">
                        State: <strong className={mat.approved ? 'text-yellow' : 'text-bone/60'}>{mat.verification.toUpperCase()}</strong>
                      </span>
                      <button
                        onClick={() => handleToggleApproveDetection(mat.id)}
                        className={`px-2.5 py-1 rounded-[2px] text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 ${
                          mat.approved
                            ? 'bg-yellow text-ink hover:bg-yellow-hover'
                            : 'bg-white/10 text-bone hover:bg-white/20'
                        }`}
                      >
                        {mat.approved ? (
                          <>
                            <Check className="w-3 h-3" />
                            VERIFIED
                          </>
                        ) : (
                          'APPROVE'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shutter / Scan Action Bar */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleCaptureFrame}
              disabled={isScanning}
              data-cursor="pointer"
              className="w-full py-3 rounded-[2px] bg-yellow hover:bg-yellow-hover text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,255,85,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>{isScanning ? 'Extracting...' : 'Freeze & Analyze Frame'}</span>
            </button>

            {capturedImage && (
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setProgressStage('idle');
                }}
                className="w-full py-2 rounded-[2px] bg-ink-surface hover:bg-white/10 border border-white/10 text-bone font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Clear & Unfreeze Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
