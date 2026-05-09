import { type NodeProps, Handle, Position } from 'reactflow';
import type { PersonNodeData } from '../../../types';

const roleLabels: Record<string, string> = {
  suspect: 'Şüpheli', witness: 'Tanık', victim: 'Mağdur', unknown: 'Bilinmiyor',
};
const roleColors: Record<string, string> = {
  suspect: 'var(--role-suspect)', witness: 'var(--role-witness)',
  victim: 'var(--role-victim)', unknown: 'var(--role-unknown)',
};

export function PersonNode({ data, selected }: NodeProps<PersonNodeData>) {
  return (
    <div className={`node-card ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--accent-primary)' : 'var(--node-person)33' }}>
      <div className="node-type-stripe" style={{ background: 'var(--node-person)' }} />
      <Handle type="target" position={Position.Left} style={{ background: 'var(--node-person)', border: 'none', width: 8, height: 8 }} />
      <div className="node-header" style={{ paddingTop: 'calc(var(--space-sm) + 3px)' }}>
        <div className="node-avatar" style={{ background: 'rgba(232,93,74,0.15)' }}>
          {data.photoUrl ? <img src={data.photoUrl} alt={data.fullName} /> : '👤'}
        </div>
        <div className="node-titles">
          <span className="node-type-badge">ŞAHIS</span>
          <span className="node-label">{data.label || data.fullName}</span>
          <span className="node-role-badge" style={{ background: roleColors[data.role] }}>{roleLabels[data.role]}</span>
        </div>
      </div>
      <div className="node-body">
        {data.nationalId && <div className="node-field"><span className="field-key">TCKN</span><span className="field-val">{data.nationalId}</span></div>}
        {data.birthDate && <div className="node-field"><span className="field-key">D. Tarihi</span><span className="field-val">{data.birthDate}</span></div>}
        {data.notes && <div className="node-notes">{data.notes}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-person)', border: 'none', width: 8, height: 8 }} />
    </div>
  );
}
