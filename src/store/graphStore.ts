import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Investigation,
  GraphNode,
  GraphEdge,
  MapPin,
  MapLine,
  ChatMessage,
  AnyNodeData,
  NodeType,
} from '../types';

const DEFAULT_INVESTIGATION: Investigation = {
  id: uuidv4(),
  title: 'Yeni Soruşturma',
  caseNumber: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [],
  edges: [],
  mapPins: [],
  mapLines: [],
  chatHistory: [],
};

interface GraphStore {
  investigation: Investigation;

  // Investigation
  updateInvestigationMeta: (title: string, caseNumber?: string) => void;
  resetInvestigation: () => void;

  // Nodes
  addNode: (type: NodeType, data: AnyNodeData, position: { x: number; y: number }) => GraphNode;
  updateNodeData: (id: string, data: Partial<AnyNodeData>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  getNodeById: (id: string) => GraphNode | undefined;

  // Edges
  addEdge: (edge: Omit<GraphEdge, 'id' | 'createdAt'>) => GraphEdge;
  updateEdge: (id: string, data: Partial<GraphEdge>) => void;
  deleteEdge: (id: string) => void;
  getEdgeById: (id: string) => GraphEdge | undefined;

  // Map Pins
  addMapPin: (pin: Omit<MapPin, 'id'>) => MapPin;
  updateMapPin: (id: string, data: Partial<MapPin>) => void;
  deleteMapPin: (id: string) => void;
  pinToNode: (pinId: string) => void;

  // Map Lines
  addMapLine: (line: Omit<MapLine, 'id'>) => MapLine;
  deleteMapLine: (id: string) => void;

  // Chat
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Utility
  getGraphJSON: () => string;
  getNodesWithDates: () => GraphNode[];
  getEdgesWithDates: () => GraphEdge[];
}

export const useGraphStore = create<GraphStore>()(
  persist(
    (set, get) => ({
      investigation: DEFAULT_INVESTIGATION,

      updateInvestigationMeta: (title, caseNumber) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            title,
            caseNumber: caseNumber ?? s.investigation.caseNumber,
            updatedAt: new Date().toISOString(),
          },
        })),

      resetInvestigation: () =>
        set({
          investigation: {
            ...DEFAULT_INVESTIGATION,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),

      addNode: (type, data, position) => {
        const node: GraphNode = {
          id: uuidv4(),
          type,
          position,
          data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({
          investigation: {
            ...s.investigation,
            nodes: [...s.investigation.nodes, node],
            updatedAt: new Date().toISOString(),
          },
        }));
        return node;
      },

      updateNodeData: (id, data) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            nodes: s.investigation.nodes.map((n) =>
              n.id === id
                ? { ...n, data: { ...n.data, ...data } as AnyNodeData, updatedAt: new Date().toISOString() }
                : n
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateNodePosition: (id, position) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            nodes: s.investigation.nodes.map((n) =>
              n.id === id ? { ...n, position } : n
            ),
          },
        })),

      deleteNode: (id) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            nodes: s.investigation.nodes.filter((n) => n.id !== id),
            edges: s.investigation.edges.filter(
              (e) => e.source !== id && e.target !== id
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      getNodeById: (id) =>
        get().investigation.nodes.find((n) => n.id === id),

      addEdge: (edgeData) => {
        const edge: GraphEdge = {
          ...edgeData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          investigation: {
            ...s.investigation,
            edges: [...s.investigation.edges, edge],
            updatedAt: new Date().toISOString(),
          },
        }));
        return edge;
      },

      updateEdge: (id, data) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            edges: s.investigation.edges.map((e) =>
              e.id === id ? { ...e, ...data } : e
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteEdge: (id) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            edges: s.investigation.edges.filter((e) => e.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      getEdgeById: (id) =>
        get().investigation.edges.find((e) => e.id === id),

      addMapPin: (pinData) => {
        const pin: MapPin = { ...pinData, id: uuidv4() };
        set((s) => ({
          investigation: {
            ...s.investigation,
            mapPins: [...s.investigation.mapPins, pin],
            updatedAt: new Date().toISOString(),
          },
        }));
        return pin;
      },

      updateMapPin: (id, data) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            mapPins: s.investigation.mapPins.map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          },
        })),

      deleteMapPin: (id) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            mapPins: s.investigation.mapPins.filter((p) => p.id !== id),
            mapLines: s.investigation.mapLines.filter((l) => l.sourcePinId !== id && l.targetPinId !== id),
          },
        })),

      addMapLine: (lineData) => {
        const line: MapLine = { ...lineData, id: uuidv4() };
        set((s) => ({
          investigation: {
            ...s.investigation,
            mapLines: [...(s.investigation.mapLines || []), line],
            updatedAt: new Date().toISOString(),
          },
        }));
        return line;
      },

      deleteMapLine: (id) =>
        set((s) => ({
          investigation: {
            ...s.investigation,
            mapLines: s.investigation.mapLines.filter((l) => l.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      pinToNode: (pinId) => {
        const pin = get().investigation.mapPins.find((p) => p.id === pinId);
        if (!pin) return;
        const nodeData = {
          type: 'location' as const,
          label: pin.label,
          address: pin.label,
          lat: pin.lat,
          lng: pin.lng,
          locationType: 'other' as const,
          timestamp: pin.timestamp,
          notes: pin.notes,
        };
        const node = get().addNode('location', nodeData, { x: 400, y: 300 });
        get().updateMapPin(pinId, { linkedNodeId: node.id });
      },

      addChatMessage: (msg) => {
        const message: ChatMessage = {
          ...msg,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          investigation: {
            ...s.investigation,
            chatHistory: [...s.investigation.chatHistory, message],
          },
        }));
      },

      clearChat: () =>
        set((s) => ({
          investigation: { ...s.investigation, chatHistory: [] },
        })),

      getGraphJSON: () =>
        JSON.stringify(
          {
            title: get().investigation.title,
            caseNumber: get().investigation.caseNumber,
            nodes: get().investigation.nodes,
            edges: get().investigation.edges,
          },
          null,
          2
        ),

      getNodesWithDates: () =>
        get().investigation.nodes.filter((n) => {
          const d = n.data as unknown as Record<string, unknown>;
          return d.timestamp || n.createdAt;
        }),

      getEdgesWithDates: () =>
        get().investigation.edges.filter((e) => e.timestamp),
    }),
    { name: 'sherlock-investigation-v1' }
  )
);
