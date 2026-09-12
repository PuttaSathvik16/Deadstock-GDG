export type MaterialForm = 'roll' | 'panel' | 'scrap' | 'garment' | 'trim' | 'accessory';

export type VerificationState = 'needs_review' | 'verified' | 'locked' | 'rejected';

export interface MaterialVisual {
  dominant_color: string;
  secondary_colors?: string[];
  pattern: string;
  texture_cues: string;
  swatch_hex?: string;
}

export interface QuantityEstimate {
  value: number | string;
  unit: string;
  confidence: number;
}

export interface MaterialProperties {
  stretch_guess: string; // e.g. "Minimal stretch (visual cue suggests rigid twill)"
  opacity_guess: string; // e.g. "Opaque (dense yarn count)"
  weight_class_guess: string; // e.g. "Heavyweight ~380 GSM"
}

export interface MaterialProvenance {
  source_image?: string;
  capture_time: string;
  user_notes?: string;
}

export interface Material {
  id: string; // e.g. "MAT-001"
  lab_id?: string;
  label: string;
  category: string; // e.g. "denim", "silk", "corduroy", "cotton", "trim"
  form: MaterialForm;
  visual: MaterialVisual;
  estimate: {
    visible_dimensions?: string;
    piece_count?: number;
    quantity_estimate: QuantityEstimate;
  };
  properties: MaterialProperties;
  provenance: MaterialProvenance;
  confidence: number;
  verification: VerificationState;
  approved: boolean;
  locked: boolean;
}

export type ConstraintType = 'HARD' | 'SOFT';

export type ConstraintSource = 
  | 'system_default' 
  | 'brief' 
  | 'user' 
  | 'inventory_limit' 
  | 'session_decision';

export interface Constraint {
  id: string;
  lab_id?: string;
  type: ConstraintType;
  source: ConstraintSource;
  title: string;
  rule: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  active: boolean;
  target_material_id?: string;
}

export interface GarmentZoneMap {
  zone: string; // e.g. "Main Bodice", "Raglan Sleeves", "Faced Hem", "Hardware / Zips"
  material_id: string;
  material_label?: string;
  usage_note?: string;
}

export type FeasibilityStatus = 'feasible' | 'invalid' | 'warning';

export interface Concept {
  id: string; // e.g. "LOOK-01"
  lab_id?: string;
  look_number: number;
  title: string;
  silhouette: string;
  description: string;
  visual_uri?: string;
  uses: string[]; // Material IDs: ['MAT-001', 'MAT-003']
  material_map: GarmentZoneMap[];
  feasibility: FeasibilityStatus;
  warnings: string[];
  version: number;
  affected?: boolean;
  change_reason?: string;
  approved?: boolean;
}

export type DecisionEventType = 
  | 'material_removed'
  | 'material_restored'
  | 'material_locked'
  | 'material_edited'
  | 'concept_approved'
  | 'silhouette_changed'
  | 'brief_updated'
  | 'constraint_added'
  | 'regenerated_concept'
  | 'consensus_logged';

export interface Decision {
  id: string;
  lab_id?: string;
  speaker_id: string;
  speaker_name: string;
  speaker_role?: string;
  speaker_avatar?: string;
  timestamp: string;
  event_type: DecisionEventType;
  payload: Record<string, any>;
  resulting_changes: string;
}

export type LabStatus = 
  | 'draft' 
  | 'analyzing' 
  | 'inventory_ready' 
  | 'generating' 
  | 'active_studio' 
  | 'completed';

export interface Lab {
  id: string;
  name: string;
  brief: string;
  audience: string;
  occasion: string;
  target_looks: number;
  created_at: string;
  owner_id: string;
  status: LabStatus;
  materials: Material[];
  constraints: Constraint[];
  concepts: Concept[];
  decisions: Decision[];
}

export interface CollectionSheetData {
  id: string;
  lab_id: string;
  collection_name: string;
  brief: string;
  created_at: string;
  material_utilization_pct: number;
  approved_materials_count: number;
  total_looks_count: number;
  materials: Material[];
  concepts: Concept[];
  constraints: Constraint[];
  decisions: Decision[];
}

export interface GeminiTokenCost {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  formattedCost: string;
  model: string;
  savings: string;
  unoptimizedEstimatePromptTokens?: number;
}

