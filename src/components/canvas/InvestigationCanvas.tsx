import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background, BackgroundVariant, Controls, MiniMap,
  MarkerType,
  type Node, type Edge, type OnConnect, type NodeChange, type EdgeChange,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { PersonNode }        from './nodes/PersonNode';
import { VehicleNode }       from './nodes/VehicleNode';
import { CommunicationNode } from './nodes/CommunicationNode';
import { LocationNode }      from './nodes/LocationNode';
import { EvidenceNode }      from './nodes/EvidenceNode';
import { NoteNode }          from './nodes/NoteNode';
import { ConfidenceEdge }    from './edges/ConfidenceEdge';
import { CanvasContextMenu, NodeContextMenu } from './ContextMenu';
import { NodeFormModal }     from './NodeFormModal';
import { EdgeFormPanel }     from './EdgeFormPanel';
import { NodeDetailPanel }   from './NodeDetailPanel';

import { useGraphStore } from '../../store/graphStore';
import { useUIStore }    from '../../store/uiStore';
import type { GraphNode, GraphEdge } from '../../types';

const nodeTypes = {
  person: PersonNode, vehicle: VehicleNode,
  communication: CommunicationNode, location: LocationNode, evidence: EvidenceNode,
  note: NoteNode,
};
const edgeTypes = { confidenceEdge: ConfidenceEdge };

const nodeColorMap: Record<string, string> = {
  person: '#e85d4a', vehicle: '#f59e0b', communication: '#8b5cf6',
  location: '#22c55e', evidence: '#38bdf8', note: '#fef08a',
};

function toFlowNodes(nodes: GraphNode[]): Node[] {
  return nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data }));
}

function toFlowEdges(edges: GraphEdge[]): Edge[] {
  return edges.map(e => ({
    id: e.id, source: e.source, target: e.target,
    type: 'confidenceEdge',
    data: { relationType: e.relationType, customLabel: e.customLabel, confidence: e.confidence },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4a6070' },
    ...(e.bidirectional ? { markerStart: { type: MarkerType.ArrowClosed, color: '#4a6070' } } : {}),
  }));
}

export function InvestigationCanvas() {
  const { investigation, updateNodePosition, deleteNode, deleteEdge } = useGraphStore();
  const {
    showContextMenu, hideContextMenu, showNodeForm, showEdgeForm,
    setSelectedNodeId, setSelectedEdgeId, selectedNodeId, edgeForm,
  } = useUIStore();
  const rfInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Node sağ tık durumu
  const [nodeCtx, setNodeCtx] = useState<{ nodeId: string; x: number; y: number } | null>(null);

  const flowNodes = toFlowNodes(investigation.nodes);
  const flowEdges = toFlowEdges(investigation.edges);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach(c => {
      if (c.type === 'position' && c.position) updateNodePosition(c.id, c.position);
      if (c.type === 'remove') deleteNode(c.id);
    });
  }, [updateNodePosition, deleteNode]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    changes.forEach(c => { if (c.type === 'remove') deleteEdge(c.id); });
  }, [deleteEdge]);

  const onConnect = useCallback<OnConnect>((params) => {
    if (!params.source || !params.target) return;
    showEdgeForm({ sourceId: params.source, targetId: params.target });
  }, [showEdgeForm]);

  // Canvas boş alana sağ tık
  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!rfInstanceRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flowPos = rfInstanceRef.current.screenToFlowPosition({
      x: e.clientX - rect.left, y: e.clientY - rect.top,
    });
    setNodeCtx(null);
    showContextMenu(e.clientX, e.clientY, flowPos.x, flowPos.y);
  }, [showContextMenu]);

  // Node'a sağ tık
  const onNodeContextMenu = useCallback((e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    e.stopPropagation();
    hideContextMenu();
    setNodeCtx({ nodeId: node.id, x: e.clientX, y: e.clientY });
  }, [hideContextMenu]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    showNodeForm({ mode: 'edit', nodeType: node.type as any, nodeId: node.id });
  }, [showNodeForm]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
    hideContextMenu();
    setNodeCtx(null);
  }, [setSelectedNodeId, setSelectedEdgeId, hideContextMenu]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
    setNodeCtx(null);
    const src = investigation.edges.find(e => e.id === edge.id);
    if (src) showEdgeForm({ edgeId: edge.id, sourceId: src.source, targetId: src.target });
  }, [setSelectedEdgeId, setSelectedNodeId, showEdgeForm, investigation.edges]);

  const onPaneClick = useCallback(() => {
    hideContextMenu();
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setNodeCtx(null);
  }, [hideContextMenu, setSelectedNodeId, setSelectedEdgeId]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} tabIndex={0}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onContextMenu={onContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onInit={inst => { rfInstanceRef.current = inst; }}
        deleteKeyCode="Delete"
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'confidenceEdge', markerEnd: { type: MarkerType.ArrowClosed } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255, 255, 255, 0.15)" />
        <Controls />
        <MiniMap
          nodeColor={n => nodeColorMap[n.type ?? ''] ?? '#334155'}
          maskColor="rgba(5,12,20,0.75)"
          style={{ background: 'var(--bg-elevated)' }}
        />
      </ReactFlow>

      {/* Sağ Panel: Seçili Node Detayı */}
      {selectedNodeId && <NodeDetailPanel />}

      {/* Kenar formu (sağda ama detay paneli yokken) */}
      {edgeForm.visible && !selectedNodeId && <EdgeFormPanel />}

      {/* Context Menüler */}
      <CanvasContextMenu />
      {nodeCtx && (
        <NodeContextMenu
          nodeId={nodeCtx.nodeId}
          x={nodeCtx.x}
          y={nodeCtx.y}
          onClose={() => setNodeCtx(null)}
        />
      )}

      {/* Node Form Modal */}
      <NodeFormModal />

      {/* Boş durum ipucu */}
      {investigation.nodes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 'var(--space-md)',
        }}>
          <div style={{ fontSize: 56, opacity: 0.08 }}>🕵️</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Canvas Boş</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.7 }}>Düğüm eklemek için canvas'a <strong>sağ tıklayın</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
