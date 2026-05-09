import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from 'reactflow';
import type { GraphEdge } from '../../../types';
import { RELATION_LABELS } from '../../../types';

const confidenceStyles = {
  confirmed:   { stroke: 'var(--status-confirmed)',   strokeWidth: 2.5, strokeDasharray: 'none' },
  probable:    { stroke: 'var(--status-probable)',    strokeWidth: 1.5, strokeDasharray: 'none' },
  speculative: { stroke: 'var(--status-speculative)', strokeWidth: 1,   strokeDasharray: '6 3'  },
};

export function ConfidenceEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  data, selected, markerEnd,
}: EdgeProps<Partial<GraphEdge>>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const style = confidenceStyles[(data?.confidence ?? 'probable') as keyof typeof confidenceStyles];
  const label = data?.customLabel || RELATION_LABELS[data?.relationType ?? 'custom'] || data?.relationType;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          filter: selected ? `drop-shadow(0 0 4px ${style.stroke})` : 'none',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            background: 'var(--bg-elevated)',
            border: `1px solid ${style.stroke}44`,
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            fontSize: 9,
            fontWeight: 500,
            color: style.stroke,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
