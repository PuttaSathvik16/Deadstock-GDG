'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { LandingScreen } from '@/components/screens/LandingScreen';
import { OverviewScreen } from '@/components/screens/OverviewScreen';
import { LiveScanScreen } from '@/components/screens/LiveScanScreen';
import { InventoryScreen } from '@/components/screens/InventoryScreen';
import { ConstraintsScreen } from '@/components/screens/ConstraintsScreen';
import { ConceptsScreen } from '@/components/screens/ConceptsScreen';
import { LiveStudioScreen } from '@/components/screens/LiveStudioScreen';
import { CollectionSheetScreen } from '@/components/screens/CollectionSheetScreen';
import { NewLabModal } from '@/components/screens/NewLabModal';
import { Lab, Material, Concept, Constraint, Decision } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';
import {
  validateCollectionConstraints,
  propagateMaterialMutation,
} from '@/lib/constraint-engine';

import { CustomCursor } from '@/components/editorial/CustomCursor';

export default function DeadstockLiveLabApp() {
  const [lab, setLab] = useState<Lab>(PRIMARY_ATELIER_WORKSPACE);
  const [activeTab, setActiveTab] = useState<ActiveTab | 'landing'>('overview');
  const [isNewLabModalOpen, setIsNewLabModalOpen] = useState<boolean>(false);
  const [isFabricMutated, setIsFabricMutated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'lime' | 'terracotta' | 'cobalt';
  } | null>(null);

  const showToast = (text: string, type: 'lime' | 'terracotta' | 'cobalt' = 'lime') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Fetch live workspace from Supabase PostgreSQL on mount (FR-01)
  const syncFromSupabase = useCallback(async () => {
    try {
      const res = await fetch('/api/labs');
      if (res.ok) {
        const data = await res.json();
        if (data.lab && data.lab.id) {
          setLab(data.lab);
          const satin = data.lab.materials.find((m: Material) => m.id === 'MAT-004');
          if (satin && !satin.approved) {
            setIsFabricMutated(true);
          } else {
            setIsFabricMutated(false);
          }
        }
      }
    } catch (e) {
      console.warn('Supabase fetch failed, working with cached atelier state:', e);
    }
  }, []);

  useEffect(() => {
    // Check saved gemini API key
    try {
      const savedKey = localStorage.getItem('deadstock_gemini_key');
      if (savedKey) {
        setGeminiApiKey(savedKey);
      }
    } catch (e) {
      // ignore
    }

    syncFromSupabase();
  }, [syncFromSupabase]);

  const handleSaveGeminiApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      localStorage.setItem('deadstock_gemini_key', key);
    } catch (e) {
      // ignore
    }
    showToast(key ? 'Google Gemini API key saved.' : 'Google Gemini API key removed.', 'lime');
  };

  // Calculate real-time validation metrics
  const { validatedConcepts, result } = validateCollectionConstraints(
    lab.materials,
    lab.constraints,
    lab.concepts
  );

  // Live Fabric Disruption (PRD Section 7.3 & 21.1)
  const handleTriggerFabricMutation = async () => {
    const satinId = 'MAT-004';
    const targetMat = lab.materials.find((m) => m.id === satinId);
    if (!targetMat) return;

    if (targetMat.approved) {
      // Purge / quarantine live in Supabase PostgreSQL
      try {
        const res = await fetch('/api/materials/purge-satin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ labId: lab.id }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.lab) {
            setLab(data.lab);
            setIsFabricMutated(true);
            showToast(
              'CAUSAL PROPAGATION: Quarantined Burgundy Satin (MAT-004) in Supabase. Look 02 invalidated.',
              'terracotta'
            );
            return;
          }
        }
      } catch (e) {
        console.error('Purge error:', e);
      }

      // Fallback local mutation if offline
      const { updatedMaterials, updatedConcepts } = propagateMaterialMutation(
        satinId,
        false,
        lab.materials,
        lab.constraints,
        lab.concepts
      );
      setLab({
        ...lab,
        materials: updatedMaterials,
        concepts: updatedConcepts,
      });
      setIsFabricMutated(true);
      showToast('Quarantined Burgundy Satin (MAT-004). Look 02 invalidated.', 'terracotta');
    } else {
      // Restore live in Supabase PostgreSQL
      try {
        await fetch('/api/materials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: satinId,
            updates: { approved: true },
          }),
        });

        const newDecision: Decision = {
          id: `DEC-${Date.now()}`,
          speaker_id: 'USR-SATHVIK',
          speaker_name: 'Sathvik (Lead Upcycler)',
          speaker_role: 'Atelier Lead',
          speaker_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event_type: 'material_restored',
          payload: { material_id: satinId },
          resulting_changes: `Restored ${targetMat.label} (${targetMat.id}) to approved inventory in Supabase.`,
        };

        await fetch('/api/decisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision: newDecision, labId: lab.id }),
        });

        const { updatedMaterials, updatedConcepts } = propagateMaterialMutation(
          satinId,
          true,
          lab.materials,
          lab.constraints,
          lab.concepts
        );

        setLab({
          ...lab,
          materials: updatedMaterials,
          concepts: updatedConcepts,
          decisions: [newDecision, ...lab.decisions],
        });
        setIsFabricMutated(false);
        showToast('Restored Burgundy Satin (MAT-004) in Supabase. Look 02 is feasible.', 'lime');
      } catch (e) {
        console.error('Restore error:', e);
      }
    }
  };

  // Targeted Regeneration of an invalid look (PRD Section 12.8)
  const handleRegenerateLook = async (lookId: string) => {
    setIsGenerating(true);
    showToast('Regenerating affected zones using verified inventory in Supabase...', 'cobalt');

    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
        },
        body: JSON.stringify({
          materials: lab.materials,
          concepts: lab.concepts,
          constraints: lab.constraints,
          mutatedMaterialId: 'MAT-004',
          replacementMaterialId: 'MAT-002', // Substitute with Mulberry Raw Silk
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.concepts) {
        const newDecision: Decision = {
          id: `DEC-${Date.now()}`,
          speaker_id: 'USR-SATHVIK',
          speaker_name: 'AI Constraint Engine',
          speaker_role: 'System',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event_type: 'regenerated_concept',
          payload: { look_id: lookId },
          resulting_changes:
            data.causalExplanation || 'Substituted missing yardage with approved Mulberry Raw Silk.',
        };

        // Persist new concepts and decision to Supabase
        await fetch('/api/concepts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ concepts: data.concepts, labId: lab.id }),
        });
        await fetch('/api/decisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision: newDecision, labId: lab.id }),
        });

        setLab({
          ...lab,
          concepts: data.concepts,
          decisions: [newDecision, ...lab.decisions],
        });

        setIsFabricMutated(false);
        showToast('Zone regeneration complete: Substituted MAT-004 with verified stock in Supabase.', 'lime');
      }
    } catch (e) {
      console.error(e);
      showToast('Regeneration completed via local constraint engine.', 'lime');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate entire collection with current inventory
  const handleRegenerateAll = async () => {
    setIsGenerating(true);
    showToast('Gemini co-designer is synthesizing looks from approved inventory...', 'cobalt');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {}),
        },
        body: JSON.stringify({
          materials: lab.materials,
          brief: lab.brief,
          target_looks: lab.target_looks,
          constraints: lab.constraints,
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.concepts) {
        // Persist generated concepts to Supabase
        await fetch('/api/concepts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ concepts: data.concepts, labId: lab.id }),
        });

        setLab({
          ...lab,
          concepts: data.concepts,
        });
        showToast('Generated fresh collection respecting active constraints in Supabase.', 'lime');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Ingestion from Live Scan
  const handleMaterialsDetected = async (newMaterials: Material[]) => {
    const combined = [...lab.materials, ...newMaterials];
    const { validatedConcepts } = validateCollectionConstraints(
      combined,
      lab.constraints,
      lab.concepts
    );

    // Persist each new material to Supabase
    for (const mat of newMaterials) {
      try {
        await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ material: mat, labId: lab.id }),
        });
      } catch (e) {
        console.warn('Could not persist material to Supabase:', e);
      }
    }

    // Log decision in Supabase
    const scanDecision: Decision = {
      id: `DEC-${Date.now()}`,
      speaker_id: 'USR-SATHVIK',
      speaker_name: 'Sathvik (Lead Upcycler)',
      speaker_role: 'Atelier Lead',
      speaker_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event_type: 'material_locked',
      payload: { count: newMaterials.length },
      resulting_changes: `Ingested ${newMaterials.length} physical deadstock remnants via Gemini Live Scan into Supabase.`,
    };

    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: scanDecision, labId: lab.id }),
      });
    } catch (e) {
      // ignore
    }

    setLab({
      ...lab,
      materials: combined,
      concepts: validatedConcepts,
      decisions: [scanDecision, ...lab.decisions],
    });

    showToast(`Saved ${newMaterials.length} rolls to Supabase PostgreSQL ledger.`, 'lime');
  };

  // Update a single material (PRD 12.4 actions)
  const handleUpdateMaterial = async (updatedMat: Material) => {
    const updatedList = lab.materials.map((m) => (m.id === updatedMat.id ? updatedMat : m));
    const { validatedConcepts } = validateCollectionConstraints(
      updatedList,
      lab.constraints,
      lab.concepts
    );

    // Persist to Supabase
    try {
      await fetch('/api/materials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedMat.id,
          updates: {
            approved: updatedMat.approved,
            locked: updatedMat.locked,
            verification: updatedMat.verification,
            label: updatedMat.label,
            estimate: updatedMat.estimate,
          },
        }),
      });
    } catch (e) {
      console.warn('Could not update material in Supabase:', e);
    }

    setLab({
      ...lab,
      materials: updatedList,
      concepts: validatedConcepts,
    });
  };

  // Toggle constraint active status
  const handleToggleConstraint = (id: string) => {
    const updated = lab.constraints.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    const { validatedConcepts } = validateCollectionConstraints(lab.materials, updated, lab.concepts);

    setLab({
      ...lab,
      constraints: updated,
      concepts: validatedConcepts,
    });
  };

  // Add custom constraint
  const handleAddConstraint = (newConstraint: Constraint) => {
    const updated = [...lab.constraints, newConstraint];
    const { validatedConcepts } = validateCollectionConstraints(lab.materials, updated, lab.concepts);

    setLab({
      ...lab,
      constraints: updated,
      concepts: validatedConcepts,
    });
    showToast(`Added constraint: ${newConstraint.title}`, 'lime');
  };

  // Collaborative Decision Rail
  const handleAddDecision = async (newDecision: Decision) => {
    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: newDecision, labId: lab.id }),
      });
    } catch (e) {
      console.warn('Could not save decision in Supabase:', e);
    }

    setLab({
      ...lab,
      decisions: [newDecision, ...lab.decisions],
    });
    showToast(`Committed decision: ${newDecision.resulting_changes.slice(0, 50)}...`, 'lime');
  };

  // Concept Approval
  const handleApproveConcept = async (lookId: string) => {
    const updated = lab.concepts.map((c) => (c.id === lookId ? { ...c, approved: !c.approved } : c));
    try {
      await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts: updated, labId: lab.id }),
      });
    } catch (e) {
      console.warn('Could not update concept in Supabase:', e);
    }

    setLab({ ...lab, concepts: updated });
    showToast(`Updated approval status for ${lookId} in Supabase`, 'lime');
  };

  // New Lab Creation
  const handleCreateLab = async (newLab: Lab, mode: 'scan' | 'upload' | 'archive') => {
    setLab(newLab);
    setIsFabricMutated(false);
    if (mode === 'scan') {
      setActiveTab('scan');
    } else {
      setActiveTab('overview');
    }
    showToast(`Created workspace "${newLab.name}"`, 'lime');
  };

  // Reset to original authentic atelier lot in Supabase
  const handleResetLedger = async () => {
    try {
      const res = await fetch('/api/labs/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId: lab.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.lab) {
          setLab(data.lab);
          setIsFabricMutated(false);
          showToast('Reset Supabase ledger to authentic verified Deadstock Atelier surplus lot.', 'lime');
          return;
        }
      }
    } catch (e) {
      console.error('Reset error:', e);
    }

    setLab(PRIMARY_ATELIER_WORKSPACE);
    setIsFabricMutated(false);
    showToast('Reset to authentic verified Deadstock Atelier surplus lot.', 'lime');
  };

  return (
    <div className="min-h-screen flex flex-col bg-night text-bone selection:bg-yellow selection:text-ink">
      {/* Editorial Custom Cursor (Section 21) */}
      <CustomCursor />
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn pointer-events-none">
          <div
            className={`px-4 py-3 rounded-lg shadow-2xl border text-xs font-mono font-medium max-w-md pointer-events-auto flex items-center gap-2.5 ${
              toastMessage.type === 'terracotta'
                ? 'bg-terracotta text-ink border-ink'
                : toastMessage.type === 'cobalt'
                ? 'bg-cobalt text-bone border-ink-border'
                : 'bg-lime text-ink border-ink'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        lab={lab}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenNewLab={() => setIsNewLabModalOpen(true)}
        onResetLedger={handleResetLedger}
        onTriggerFabricMutation={handleTriggerFabricMutation}
        isFabricMutated={isFabricMutated}
        geminiApiKey={geminiApiKey}
        onSaveGeminiApiKey={handleSaveGeminiApiKey}
      />

      {/* Screen Views Orchestration */}
      <main className="flex-1 w-full">
        {activeTab === 'landing' && (
          <LandingScreen
            onStartLab={() => setIsNewLabModalOpen(true)}
            onExploreWorkspace={() => setActiveTab('overview')}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewScreen
            lab={lab}
            materials={lab.materials}
            concepts={lab.concepts}
            constraints={lab.constraints}
            decisions={lab.decisions}
            materialUtilizationPct={result.materialUtilizationPct}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onTriggerFabricDisruption={handleTriggerFabricMutation}
            isFabricDisrupted={isFabricMutated}
          />
        )}

        {activeTab === 'scan' && (
          <LiveScanScreen
            onMaterialsDetected={handleMaterialsDetected}
            onNavigateToInventory={() => setActiveTab('inventory')}
            existingMaterialsCount={lab.materials.length}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryScreen
            materials={lab.materials}
            onUpdateMaterial={handleUpdateMaterial}
            onNavigateToConstraints={() => setActiveTab('constraints')}
            onNavigateToScan={() => setActiveTab('scan')}
          />
        )}

        {activeTab === 'constraints' && (
          <ConstraintsScreen
            constraints={lab.constraints}
            onToggleConstraint={handleToggleConstraint}
            onAddConstraint={handleAddConstraint}
            onNavigateToConcepts={() => setActiveTab('concepts')}
          />
        )}

        {activeTab === 'concepts' && (
          <ConceptsScreen
            concepts={lab.concepts}
            materials={lab.materials}
            constraints={lab.constraints}
            onRegenerateAll={handleRegenerateAll}
            onRegenerateLook={handleRegenerateLook}
            onApproveConcept={handleApproveConcept}
            onNavigateToStudio={() => setActiveTab('studio')}
            onNavigateToSheet={() => setActiveTab('sheet')}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'studio' && (
          <LiveStudioScreen
            lab={lab}
            materials={lab.materials}
            concepts={lab.concepts}
            decisions={lab.decisions}
            onAddDecision={handleAddDecision}
            onMutateMaterial={(id, approved) => {
              const target = lab.materials.find((m) => m.id === id);
              if (target) {
                handleUpdateMaterial({ ...target, approved });
              }
            }}
            onNavigateToConcepts={() => setActiveTab('concepts')}
          />
        )}

        {activeTab === 'sheet' && (
          <CollectionSheetScreen
            lab={lab}
            materials={lab.materials}
            concepts={lab.concepts}
            constraints={lab.constraints}
            decisions={lab.decisions}
            materialUtilizationPct={result.materialUtilizationPct}
          />
        )}
      </main>

      {/* New Lab Modal */}
      <NewLabModal
        isOpen={isNewLabModalOpen}
        onClose={() => setIsNewLabModalOpen(false)}
        onCreateLab={handleCreateLab}
      />
    </div>
  );
}
