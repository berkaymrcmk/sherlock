// ─── Node Tipleri ────────────────────────────────────────────────────────────

export type NodeType =
  | 'person'
  | 'vehicle'
  | 'communication'
  | 'location'
  | 'evidence'
  | 'note';

export type SuspectRole = 'suspect' | 'witness' | 'victim' | 'unknown';

export type ThreatLevel = 1 | 2 | 3 | 4 | 5;

export interface PersonNodeData {
  type: 'person';
  label: string;
  fullName: string;
  nationalId: string;
  birthDate: string;
  role: SuspectRole;
  photoUrl?: string;
  notes?: string;
  threatLevel: ThreatLevel;
}

export interface VehicleNodeData {
  type: 'vehicle';
  label: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  year?: number;
  photoUrl?: string;
  notes?: string;
}

export interface CommunicationNodeData {
  type: 'communication';
  label: string;
  phoneNumber?: string;
  imei?: string;
  email?: string;
  ipAddress?: string;
  carrier?: string;
  notes?: string;
}

export interface LocationNodeData {
  type: 'location';
  label: string;
  address: string;
  lat: number;
  lng: number;
  locationType: 'crime_scene' | 'residence' | 'workplace' | 'transit' | 'other';
  timestamp?: string;
  notes?: string;
}

export interface EvidenceNodeData {
  type: 'evidence';
  label: string;
  evidenceType: 'statement' | 'forensic_report' | 'weapon' | 'digital' | 'physical';
  caseNumber?: string;
  collectedAt?: string;
  collectedBy?: string;
  notes?: string;
}

export interface NoteNodeData {
  type: 'note';
  label: string;
  text: string;
  color?: string;
}

export type AnyNodeData =
  | PersonNodeData
  | VehicleNodeData
  | CommunicationNodeData
  | LocationNodeData
  | EvidenceNodeData
  | NoteNodeData;

export interface GraphNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: AnyNodeData;
  createdAt: string;
  updatedAt: string;
}

// ─── Edge Tipleri ────────────────────────────────────────────────────────────

export type RelationType =
  | 'owns'
  | 'communicated_with'
  | 'was_at_location'
  | 'related_to'
  | 'associate_of'
  | 'used_vehicle'
  | 'called'
  | 'linked_to_evidence'
  | 'traveled_to'
  | 'custom';

export type ConfidenceLevel = 'confirmed' | 'probable' | 'speculative';

export const RELATION_LABELS: Record<RelationType, string> = {
  owns: 'Sahibi',
  communicated_with: 'Görüştü',
  was_at_location: 'Olay Yerindeydi',
  related_to: 'Akrabası',
  associate_of: 'İş Ortağı / Tanıdık',
  used_vehicle: 'Kullandı',
  called: 'Aradı',
  linked_to_evidence: 'Kanıta Bağlı',
  traveled_to: 'Hareket Etti',
  custom: 'Özel',
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  confirmed: 'Doğrulandı',
  probable: 'Muhtemel',
  speculative: 'Spekülatif',
};

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: RelationType;
  customLabel?: string;
  timestamp?: string;
  confidence: ConfidenceLevel;
  bidirectional: boolean;
  notes?: string;
  createdAt: string;
}

// ─── Harita Tipleri ───────────────────────────────────────────────────────────

export type PinType = 'crime_scene' | 'suspect_location' | 'evidence' | 'camera' | 'route_point' | 'other';

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  timestamp?: string;
  linkedNodeId?: string;
  pinType: PinType;
  radius?: number;
  notes?: string;
}

// ─── Chat Tipleri ─────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MapLine {
  id: string;
  sourcePinId: string;
  targetPinId: string;
  label?: string;
  color?: string;
}

// ─── Ana Soruşturma State ─────────────────────────────────────────────────────

export interface Investigation {
  id: string;
  title: string;
  caseNumber?: string;
  createdAt: string;
  updatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  mapPins: MapPin[];
  mapLines: MapLine[];
  chatHistory: ChatMessage[];
}

// ─── UI State Tipleri ─────────────────────────────────────────────────────────

export type ActiveModule = 'canvas' | 'map' | 'timeline' | 'chat';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  flowX: number;
  flowY: number;
}

export interface NodeFormState {
  visible: boolean;
  mode: 'add' | 'edit';
  nodeType?: NodeType;
  nodeId?: string;
  initialPosition?: { x: number; y: number };
}

export interface EdgeFormState {
  visible: boolean;
  edgeId?: string;
  sourceId?: string;
  targetId?: string;
}
