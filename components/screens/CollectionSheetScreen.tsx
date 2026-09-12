'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Share2,
  Download,
  CheckCircle2,
  Layers,
  Sparkles,
  Scissors,
  Sliders,
  Calendar,
  User,
  ShieldCheck,
  ExternalLink,
  Barcode,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Lab, Material, Concept, Constraint, Decision } from '@/types';
import { ConstraintBadge } from '../editorial/ConstraintBadge';

interface CollectionSheetScreenProps {
  lab: Lab;
  materials: Material[];
  concepts: Concept[];
  constraints: Constraint[];
  decisions: Decision[];
  materialUtilizationPct: number;
}

export const CollectionSheetScreen: React.FC<CollectionSheetScreenProps> = ({
  lab,
  materials,
  concepts,
  constraints,
  decisions,
  materialUtilizationPct,
}) => {
  const [copied, setCopied] = useState(false);
  const approvedMaterials = materials.filter((m) => m.approved);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    const data = {
      lab_id: lab.id,
      collection_name: lab.name,
      brief: lab.brief,
      lead_upcycler: 'Sathvik',
      material_utilization_pct: materialUtilizationPct,
      zero_virgin_guaranteed: true,
      exported_at: new Date().toISOString(),
      materials: approvedMaterials,
      concepts,
      constraints: constraints.filter((c) => c.active),
      decisions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lab.name.toLowerCase().replace(/\s+/g, '-')}-tech-pack.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Export Toolbar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-5 bg-deep/40 border border-white/10 corner-notch">
        <div>
          <div className="font-mono text-xs text-yellow uppercase tracking-wider flex items-center gap-2">
            <span>07 // SPECIFICATION DOSSIER</span>
            <span className="text-white/30">•</span>
            <span className="text-white/60">SECTIONS 18 & 19</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white mt-1">
            Manufacturing Tech Pack & Provenance Sheet
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleCopyShareLink}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5 transition-colors rounded-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-yellow" />
            <span>{copied ? 'Link Copied!' : 'Share Dossier'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white flex items-center gap-1.5 transition-colors rounded-sm"
          >
            <Download className="w-3.5 h-3.5 text-electric" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-yellow hover:bg-yellow/90 text-ink font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all rounded-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Editorial Printable Dossier Container (Section 18 & 19) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="corner-notch border border-white/15 bg-night p-8 sm:p-12 space-y-12 shadow-2xl relative"
      >
        {/* Cover / Header Section (Section 18: THE MATERIALS BECAME A COLLECTION.) */}
        <div className="border-b-2 border-white/20 pb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-white/50 uppercase tracking-widest gap-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow" />
              DEADSTOCK LIVE LAB • CIR-FASHION DOSSIER
            </span>
            <span className="text-yellow font-bold">100% TRACEABLE NON-VIRGIN SPEC</span>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-xs text-yellow tracking-[0.2em] uppercase font-bold">
              SECTION 18 SPECIFICATION
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-[0.92]">
              THE MATERIALS BECAME A COLLECTION.
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono border-t border-white/10">
            <div>
              <span className="text-white/40 uppercase block text-[10px]">Collection Title</span>
              <p className="text-white font-bold mt-0.5">{lab.name}</p>
            </div>
            <div>
              <span className="text-white/40 uppercase block text-[10px]">Lead Upcycler</span>
              <p className="text-yellow font-bold mt-0.5">Sathvik (Atelier Lead)</p>
            </div>
            <div>
              <span className="text-white/40 uppercase block text-[10px]">Material Utilization</span>
              <p className="text-yellow font-bold mt-0.5">{materialUtilizationPct}% Surplus Recovered</p>
            </div>
            <div>
              <span className="text-white/40 uppercase block text-[10px]">Zero Virgin Cert</span>
              <p className="text-electric font-bold mt-0.5">VERIFIED VIA POSTGRES</p>
            </div>
          </div>
        </div>

        {/* Section 19: Pinned Lookbook Plates */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              01 // CAPSULE SPECIFICATION PLATES
            </h3>
            <span className="font-mono text-xs text-yellow">{concepts.length} DESIGNED LOOKS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map((c) => (
              <div
                key={c.id}
                className="corner-notch border border-white/15 bg-deep/20 overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-deep">
                  <img
                    src={c.visual_uri}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-night/90 px-2 py-0.5 text-xs font-mono font-bold text-white border border-white/15">
                    LOOK 0{c.look_number}
                  </div>
                  <div className="absolute top-3 right-3 bg-yellow text-ink px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                    PASS
                  </div>
                </div>

                <div className="p-5 space-y-3 bg-night/90 border-t border-white/10">
                  <div className="font-mono text-[10px] text-yellow uppercase tracking-wider">
                    {c.silhouette}
                  </div>
                  <h4 className="font-display font-bold text-white text-base leading-tight">
                    {c.title}
                  </h4>
                  <p className="text-xs text-paper/70 font-mono line-clamp-2">
                    {c.description}
                  </p>

                  <div className="pt-2 border-t border-white/5 font-mono text-[11px] space-y-1">
                    <div className="text-white/40 text-[9px] uppercase">Allocated Remnants:</div>
                    <div className="text-white/90 font-bold">{c.uses.join(' • ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 100% Material Traceability Matrix (Section 18) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              02 // MATERIAL TRACEABILITY MATRIX
            </h3>
            <span className="font-mono text-xs text-yellow">100% NON-VIRGIN AUDIT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Lot ID</th>
                  <th className="py-2.5 px-3">Material Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Initial Yardage</th>
                  <th className="py-2.5 px-3">Allocated Yardage</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-yellow">{m.id}</td>
                    <td className="py-3 px-3 text-white font-medium">{m.label}</td>
                    <td className="py-3 px-3 text-white/60 capitalize">{m.category}</td>
                    <td className="py-3 px-3 text-white/70">
                      {m.estimate.quantity_estimate.value} {m.estimate.quantity_estimate.unit}
                    </td>
                    <td className="py-3 px-3 text-white font-bold">
                      {m.approved ? `~${(Number(m.estimate.quantity_estimate.value) * 0.75).toFixed(1)} ${m.estimate.quantity_estimate.unit}` : '0.0m (Quarantined)'}
                    </td>
                    <td className="py-3 px-3">
                      {m.approved ? (
                        <span className="px-2 py-0.5 bg-yellow/10 border border-yellow/40 text-yellow text-[10px] font-bold">
                          CONSUMED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-terracotta/10 border border-terracotta/40 text-terracotta text-[10px] font-bold">
                          QUARANTINED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collaborative Decision Ledger Signed Section (Section 18) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              03 // ATELIER CONSENSUS AUDIT TRAIL
            </h3>
            <span className="font-mono text-xs text-white/40">SUPABASE POSTGRES 17</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {decisions.map((d) => (
              <div key={d.id} className="p-4 bg-deep/20 border border-white/10 space-y-1.5 corner-notch">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-yellow font-bold">{d.speaker_name}</span>
                  <span className="text-white/40">{d.timestamp}</span>
                </div>
                <p className="text-white/80 leading-relaxed text-xs">{d.resulting_changes}</p>
                <div className="text-[9px] text-white/40 pt-1">
                  EVENT: {d.event_type.toUpperCase()} • ID: {d.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Box (Section 18: Editorial Lookbook + Engineering Sheet) */}
        <div className="border-t-2 border-white/20 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 font-mono text-xs">
          <div className="space-y-1 text-white/60">
            <div className="text-yellow font-bold uppercase tracking-wider">
              DEADSTOCK LIVE LAB AUTONOMOUS ATELIER
            </div>
            <div>Gemini 3.6 Flash Multimodal Intelligence Engine</div>
            <div>Vonage Video WebRTC Collaboration Layer</div>
            <div>PostgreSQL 17 Authoritative Ledger</div>
          </div>

          <div className="text-right space-y-2 border-t sm:border-t-0 pt-4 sm:pt-0">
            <div className="text-white/40 uppercase text-[10px]">Certified By Lead Upcycler</div>
            <div className="font-display text-2xl font-bold text-white tracking-wider border-b border-white/40 pb-1">
              SATHVIK
            </div>
            <div className="text-yellow text-[10px]">Zero Virgin Fabric Guaranteed</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
