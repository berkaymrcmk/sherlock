import { Handle, Position, type NodeProps } from 'reactflow';
import type { CommunicationNodeData } from '../../../types';

export function CommunicationNode({ data, selected }: NodeProps<CommunicationNodeData>) {
  return (
    <div className={`node-card ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--accent-primary)' : 'var(--node-communication)33' }}>
      <div className="node-type-stripe" style={{ background: 'var(--node-communication)' }} />
      <Handle type="target" position={Position.Left} style={{ background: 'var(--node-communication)', border: 'none', width: 8, height: 8 }} />
      <div className="node-header" style={{ paddingTop: 'calc(var(--space-sm) + 3px)' }}>
        <div className="node-avatar" style={{ background: 'rgba(139,92,246,0.15)', fontSize: 20 }}>📱</div>
        <div className="node-titles">
          <span className="node-type-badge">İLETİŞİM / CİHAZ</span>
          <span className="node-label">{data.label}</span>
          {data.carrier && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{data.carrier}</span>}
        </div>
      </div>
      <div className="node-body">
        {data.phoneNumber && <div className="node-field"><span className="field-key">Tel</span><span className="field-val" style={{ fontFamily: 'var(--font-mono)' }}>{data.phoneNumber}</span></div>}
        {data.imei && <div className="node-field"><span className="field-key">IMEI</span><span className="field-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{data.imei}</span></div>}
        {data.email && <div className="node-field"><span className="field-key">E-posta</span><span className="field-val">{data.email}</span></div>}
        {data.ipAddress && <div className="node-field"><span className="field-key">IP</span><span className="field-val" style={{ fontFamily: 'var(--font-mono)' }}>{data.ipAddress}</span></div>}
        {data.notes && <div className="node-notes">{data.notes}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-communication)', border: 'none', width: 8, height: 8 }} />
    </div>
  );
}
