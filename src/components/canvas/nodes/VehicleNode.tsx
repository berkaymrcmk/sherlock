import { Handle, Position, type NodeProps } from 'reactflow';
import type { VehicleNodeData } from '../../../types';

export function VehicleNode({ data, selected }: NodeProps<VehicleNodeData>) {
  return (
    <div className={`node-card ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--accent-primary)' : 'var(--node-vehicle)33' }}>
      <div className="node-type-stripe" style={{ background: 'var(--node-vehicle)' }} />
      <Handle type="target" position={Position.Left} style={{ background: 'var(--node-vehicle)', border: 'none', width: 8, height: 8 }} />
      <div className="node-header" style={{ paddingTop: 'calc(var(--space-sm) + 3px)' }}>
        <div className="node-avatar" style={{ background: 'rgba(245,158,11,0.15)', fontSize: 20 }}>
          {data.photoUrl ? <img src={data.photoUrl} alt={data.plate} /> : '🚗'}
        </div>
        <div className="node-titles">
          <span className="node-type-badge">ARAÇ</span>
          <span className="node-label" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{data.plate}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{data.brand} {data.model}</span>
        </div>
      </div>
      <div className="node-body">
        {data.color && <div className="node-field"><span className="field-key">Renk</span><span className="field-val">{data.color}</span></div>}
        {data.year && <div className="node-field"><span className="field-key">Yıl</span><span className="field-val">{data.year}</span></div>}
        {data.notes && <div className="node-notes">{data.notes}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-vehicle)', border: 'none', width: 8, height: 8 }} />
    </div>
  );
}
