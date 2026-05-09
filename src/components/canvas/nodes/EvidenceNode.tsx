import { Handle, Position, type NodeProps } from 'reactflow';
import type { EvidenceNodeData } from '../../../types';

const evTypeLabels: Record<string, string> = {
  statement: 'İfade Tutanağı', forensic_report: 'Adli Tıp Raporu',
  weapon: 'Silah', digital: 'Dijital Delil', physical: 'Fiziksel Delil',
};
const evTypeIcons: Record<string, string> = {
  statement: '📄', forensic_report: '🔬', weapon: '🔫', digital: '💾', physical: '🧪',
};

export function EvidenceNode({ data, selected }: NodeProps<EvidenceNodeData>) {
  return (
    <div className={`node-card ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--accent-primary)' : 'var(--node-evidence)33' }}>
      <div className="node-type-stripe" style={{ background: 'var(--node-evidence)' }} />
      <Handle type="target" position={Position.Left} style={{ background: 'var(--node-evidence)', border: 'none', width: 8, height: 8 }} />
      <div className="node-header" style={{ paddingTop: 'calc(var(--space-sm) + 3px)' }}>
        <div className="node-avatar" style={{ background: 'rgba(56,189,248,0.15)', fontSize: 20 }}>
          {evTypeIcons[data.evidenceType] ?? '📁'}
        </div>
        <div className="node-titles">
          <span className="node-type-badge">KANIT / BELGE</span>
          <span className="node-label">{data.label}</span>
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: 'rgba(56,189,248,0.12)', color: 'var(--node-evidence)', display: 'inline-block', marginTop: 2 }}>
            {evTypeLabels[data.evidenceType]}
          </span>
        </div>
      </div>
      <div className="node-body">
        {data.caseNumber && <div className="node-field"><span className="field-key">Dosya No</span><span className="field-val" style={{ fontFamily: 'var(--font-mono)' }}>{data.caseNumber}</span></div>}
        {data.collectedAt && <div className="node-field"><span className="field-key">Toplama</span><span className="field-val">{new Date(data.collectedAt).toLocaleDateString('tr-TR')}</span></div>}
        {data.collectedBy && <div className="node-field"><span className="field-key">Toplayan</span><span className="field-val">{data.collectedBy}</span></div>}
        {data.notes && <div className="node-notes">{data.notes}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-evidence)', border: 'none', width: 8, height: 8 }} />
    </div>
  );
}
