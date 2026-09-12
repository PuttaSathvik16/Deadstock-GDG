'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
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
  Edit3,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Material, GeminiTokenCost } from '@/types';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface LiveScanScreenProps {
  onMaterialsDetected: (newMaterials: Material[]) => void;
  onNavigateToInventory: () => void;
  existingMaterialsCount: number;
}

const REAL_DEADSTOCK_FABRIC_FEEDS = [
  {
    name: 'Vintage Indigo Selvedge 13.5oz',
    url: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Washed Army Canvas Duck',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Heavy Ribbed Knit Collar Stock',
    url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85',
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
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedMaterial, setDetectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scanTokenCost, setScanTokenCost] = useState<GeminiTokenCost | null>(null);
  const [scanRateLimitError, setScanRateLimitError] = useState<string | null>(null);

  // Editable fields when user clicks [ EDIT ]
  const [editLabel, setEditLabel] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editQuantity, setEditQuantity] = useState(3.0);

  // Stop camera tracks cleanly so the physical device camera light turns off
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCamera(false);
    setIsCameraActive(false);
  }, []);

  // Start WebRTC camera stream when active
  const startCamera = useCallback(async () => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
          setIsCameraActive(true);
          setCameraError(null);
        }
      } else {
        setCameraError('Camera API not accessible in this context. Use studio preset or upload.');
        setHasCamera(false);
        setIsCameraActive(false);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err.message);
      setCameraError('Camera preview inactive. You can use authentic mill presets or upload photos.');
      setHasCamera(false);
      setIsCameraActive(false);
    }
  }, []);

  // Initialize camera only on mount; ALWAYS shut down hardware tracks on unmount
  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [startCamera]);

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

    // IMMEDIATELY TURN OFF THE CAMERA HARDWARE
    stopCamera();

    setCapturedImage(imagePayload);
    await runScanningSequence(imagePayload);
  };

  // Handle image upload from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately stop camera since user is uploading an image
    stopCamera();

    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result as string;
      setCapturedImage(b64);
      await runScanningSequence(b64);
    };
    reader.readAsDataURL(file);
  };

  // Manual camera toggle (ON <-> OFF)
  const handleToggleCamera = () => {
    if (isCameraActive && hasCamera) {
      stopCamera();
    } else {
      setCapturedImage(null);
      startCamera();
    }
  };

  // Retake photo: clear inspection state and turn camera back ON
  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedMaterial(null);
    setIsEditing(false);
    setScanRateLimitError(null);
    startCamera();
  };

  // Step-by-step fashion-tech scanning sequence
  const runScanningSequence = async (imageData: string) => {
    setIsScanning(true);
    setScanStep(1); // 01 Detecting texture
    setDetectedMaterial(null);
    setIsEditing(false);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 380);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          existingCount: existingMaterialsCount,
        }),
      });

      if (res.status === 429) {
        clearInterval(stepInterval);
        const errData = await res.json().catch(() => ({}));
        setScanRateLimitError(
          errData.message || 'Vision scan rate limit reached (15 req/min). Please wait a moment.'
        );
        return;
      }

      setScanRateLimitError(null);
      const data = await res.json();
      clearInterval(stepInterval);
      setScanStep(5);

      if (data.tokenCost) {
        setScanTokenCost(data.tokenCost);
      }

      if (data.materials && Array.isArray(data.materials) && data.materials.length > 0) {
        const primary = data.materials[0];
        setDetectedMaterial(primary);
        setEditLabel(primary.label);
        setEditCategory(primary.category);
        setEditQuantity(primary.estimate.quantity_estimate.value || 3.0);
      }
    } catch (err: any) {
      console.error('Scan failed:', err);
      clearInterval(stepInterval);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAcceptMaterial = () => {
    if (!detectedMaterial) return;

    const finalizedMaterial: Material = {
      ...detectedMaterial,
      label: editLabel || detectedMaterial.label,
      category: editCategory || detectedMaterial.category,
      estimate: {
        ...detectedMaterial.estimate,
        quantity_estimate: {
          ...detectedMaterial.estimate.quantity_estimate,
          value: editQuantity,
        },
      },
      approved: true,
      verification: 'verified',
    };

    onMaterialsDetected([finalizedMaterial]);
    onNavigateToInventory();
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
      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-deep/40">
        <div>
          <div className="font-mono text-xs text-yellow tracking-[0.18em] uppercase font-bold flex items-center gap-2">
            <span>02 // PHYSICAL MATERIAL SCANNER</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">AUTONOMOUS DETECTION</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
            SCAN THE MATERIAL.
          </h1>
          <p className="text-xs sm:text-sm text-paper/70 font-mono mt-0.5">
            Show us what exists. The lab will do the rest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToInventory}
            className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Review Inventory ({existingMaterialsCount})</span>
            <ArrowRight className="w-3.5 h-3.5 text-yellow" />
          </button>
        </div>
      </div>

      {/* Main Viewport & Analysis Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left / Center Viewport (col-span-7) */}
        <div className="lg:col-span-7 relative flex items-center justify-center overflow-hidden bg-black/60 border-r border-white/10">
          {/* Live WebRTC Camera Stream */}
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
                className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-[1px]"
              />
              <div className="relative z-10 max-w-md p-6 bg-night/90 border border-white/15 space-y-4 shadow-2xl corner-notch">
                <div className="w-12 h-12 rounded-sm bg-yellow/10 border border-yellow/40 text-yellow flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  Position Physical Remnant
                </h3>
                <p className="text-xs text-paper/70 font-mono leading-relaxed">
                  {cameraError || 'Place fabrics, rolls, or trims inside the viewfinder frame.'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2 font-mono text-xs">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-electric" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    onClick={handleCaptureFrame}
                    className="px-4 py-2 rounded-sm bg-yellow text-ink font-bold flex items-center gap-1.5 shadow"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Inspect Preset Lot</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Technical Corner Brackets & Reticle (Section 9) */}
          <div className="absolute inset-6 sm:inset-12 pointer-events-none border border-white/15 flex flex-col justify-between p-4 z-20">
            {isScanning && <div className="animate-scanline" />}

            {/* Top Corners & Camera Power Toggle */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 border-t-2 border-l-2 border-yellow" />
                <button
                  onClick={handleToggleCamera}
                  className={`px-3 py-1.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                    isCameraActive && hasCamera
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                  title={isCameraActive && hasCamera ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isCameraActive && hasCamera ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CAM: ON</span>
                    </>
                  ) : (
                    <>
                      <CameraOff className="w-3.5 h-3.5 text-white/50" />
                      <span>CAM: OFF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {capturedImage && (
                  <button
                    onClick={handleRetake}
                    className="px-3 py-1.5 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider bg-yellow text-ink border border-yellow flex items-center gap-1.5 hover:scale-105 transition-all shadow"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RETAKE / LIVE CAM</span>
                  </button>
                )}
                <div className="w-7 h-7 border-t-2 border-r-2 border-yellow" />
              </div>
            </div>

            {/* Shutter Button in Viewport Bottom */}
            <div className="pointer-events-auto self-center pb-2">
              <button
                onClick={handleCaptureFrame}
                disabled={isScanning}
                className="px-6 py-3 rounded-sm bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(242,255,85,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{isScanning ? 'Analyzing Fabric...' : '● SCAN MATERIAL'}</span>
              </button>
            </div>

            {/* Bottom Corners */}
            <div className="flex justify-between">
              <div className="w-7 h-7 border-b-2 border-l-2 border-yellow" />
              <div className="w-7 h-7 border-b-2 border-r-2 border-yellow" />
            </div>
          </div>
        </div>

        {/* Right Rail: Fashion-Tech Sequence & Result Card (col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-deep/20 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-6">
            {/* Rate Limit Alert */}
            {scanRateLimitError && (
              <div className="corner-notch p-4 bg-terracotta/20 border border-terracotta text-terracotta font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-terracotta" />
                <span>{scanRateLimitError}</span>
              </div>
            )}

            {/* Step Sequence State (Section 4) */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="corner-notch p-6 bg-night border border-yellow/50 space-y-4 shadow-xl"
              >
                <div className="font-mono text-xs text-yellow font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow animate-ping" />
                  <span>ANALYZING MATERIAL</span>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">01 Detecting texture</span>
                    <span className={scanStep >= 1 ? 'text-yellow font-bold' : 'text-white/30'}>
                      {scanStep >= 1 ? '✓' : '...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">02 Identifying material</span>
                    <span className={scanStep >= 2 ? 'text-yellow font-bold' : 'text-white/30'}>
                      {scanStep >= 2 ? '✓' : '...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">03 Reading color</span>
                    <span className={scanStep >= 3 ? 'text-yellow font-bold' : 'text-white/30'}>
                      {scanStep >= 3 ? '✓' : '...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">04 Estimating properties</span>
                    <span className={scanStep >= 4 ? 'text-yellow font-bold' : 'text-white/30'}>
                      {scanStep >= 4 ? '✓' : '...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">05 Building material ID</span>
                    <span className={scanStep >= 5 ? 'text-yellow font-bold' : 'text-white/30'}>
                      {scanStep >= 5 ? '✓' : '...'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Result Card: MATERIAL DETECTED (Section 5) */}
            <AnimatePresence>
              {detectedMaterial && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="corner-notch p-6 bg-night border border-yellow/60 space-y-5 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                    <span className="text-yellow font-bold uppercase tracking-wider">
                      MATERIAL DETECTED
                    </span>
                    <span className="text-white/50">{detectedMaterial.id}</span>
                  </div>

                  {/* Fabric Swatch & Title */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-deep shrink-0 border border-white/15 relative">
                      <img
                        src={detectedMaterial.provenance.source_image}
                        alt={detectedMaterial.label}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white/30"
                        style={{ backgroundColor: detectedMaterial.visual.swatch_hex }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-display font-bold text-xl text-white tracking-tight uppercase leading-tight truncate">
                        {editLabel}
                      </h3>
                      <div className="font-mono text-xs text-paper/70">
                        {detectedMaterial.properties.weight_class_guess} • {detectedMaterial.visual.pattern}
                      </div>
                      <div className="text-yellow font-mono text-xs font-bold pt-1">
                        {Math.round(detectedMaterial.confidence * 100)}% CONFIDENCE
                      </div>
                    </div>
                  </div>

                  {/* Token Cost Auditor Pill */}
                  {scanTokenCost && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-yellow/10 border border-yellow/30 rounded-sm font-mono text-[11px] text-yellow">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Zap className="w-3.5 h-3.5 text-yellow" />
                        <span>VISION AUDIT: {scanTokenCost.totalTokens} TOKENS ({scanTokenCost.formattedCost})</span>
                      </div>
                      <span className="text-white/60 text-[10px]">{scanTokenCost.savings}</span>
                    </div>
                  )}

                  {/* Properties Table */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs border-t border-white/10 pt-4">
                    <div className="p-3 bg-deep/40 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Material Type</span>
                      <span className="text-white font-semibold capitalize">{editCategory}</span>
                    </div>
                    <div className="p-3 bg-deep/40 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Color Hue</span>
                      <span className="text-white font-semibold">{detectedMaterial.visual.dominant_color}</span>
                    </div>
                    <div className="p-3 bg-deep/40 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Usable Yardage</span>
                      <span className="text-yellow font-semibold">{editQuantity} meters</span>
                    </div>
                    <div className="p-3 bg-deep/40 rounded-sm border border-white/10">
                      <span className="text-white/40 block text-[10px] uppercase">Authority</span>
                      <span className="text-white font-semibold">Gemini + User</span>
                    </div>
                  </div>

                  {/* Inline Edit Details Drawer */}
                  {isEditing && (
                    <div className="p-4 bg-white/5 border border-white/15 space-y-3 font-mono text-xs">
                      <div className="text-[10px] text-yellow uppercase font-bold">Override AI Attributes</div>
                      <div>
                        <label className="text-[10px] text-white/50 block mb-1">Textile Label</label>
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-night border border-white/15 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/50 block mb-1">Category</label>
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-night border border-white/15 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 block mb-1">Quantity (m)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-night border border-white/15 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions: ACCEPT, EDIT, RETAKE */}
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleAcceptMaterial}
                        className="py-3 px-4 rounded-sm bg-yellow hover:bg-yellow/90 text-ink font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,255,85,0.3)] transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>[ ACCEPT ]</span>
                      </button>

                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="py-3 px-4 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-yellow" />
                        <span>{isEditing ? 'Done Editing' : '[ EDIT ]'}</span>
                      </button>
                    </div>

                    <button
                      onClick={handleRetake}
                      className="w-full py-2.5 px-4 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-yellow" />
                      <span>Scan Another Remnant (Restart Camera)</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!detectedMaterial && !isScanning && (
              <div className="p-8 border border-dashed border-white/15 text-center space-y-3 font-mono text-xs">
                <Eye className="w-8 h-8 text-white/40 mx-auto" />
                <div className="text-white font-bold uppercase tracking-wider">Awaiting Material Frame</div>
                <p className="text-paper/60 text-[11px] leading-relaxed">
                  Position your deadstock sample in the viewfinder and click <strong>● SCAN MATERIAL</strong> to initiate multimodal classification.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>Gemini Multimodal Vision Pipeline</span>
            <span>Zero-Virgin Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
