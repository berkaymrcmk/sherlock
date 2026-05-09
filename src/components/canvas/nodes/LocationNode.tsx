import { Handle, Position, type NodeProps } from 'reactflow';
import type { LocationNodeData } from '../../../types';

const locTypeLabels: Record<string, string> = {
  crime_scene: 'Olay Yeri', residence: 'İkametgah',
  workplace: 'İş Yeri', transit: 'Güzergah', other: 'Diğer',
};

export function LocationNode({ data, selected }: NodeProps<LocationNodeData>) {
  return (
    <div className={`node-card ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? 'var(--accent-primary)' : 'var(--node-location)33' }}>
      <div className="node-type-stripe" style={{ background: 'var(--node-location)' }} />
      <Handle type="target" position={Position.Left} style={{ background: 'var(--node-location)', border: 'none', width: 8, height: 8 }} />
      <div className="node-header" style={{ paddingTop: 'calc(var(--space-sm) + 3px)' }}>
        <div className="node-avatar" style={{ background: 'rgba(34,197,94,0.15)', fontSize: 20 }}>📍</div>
        <div className="node-titles">
          <span className="node-type-badge">LOKASYON</span>
          <span className="node-label">{data.label}</span>
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 2, background: 'rgba(34,197,94,0.15)', color: 'var(--node-location)', display: 'inline-block', marginTop: 2 }}>
            {locTypeLabels[data.locationType]}
          </span>
        </div>
      </div>
      <div className="node-body">
        {data.address && <div className="node-field"><span className="field-key">Adres</span><span className="field-val">{data.address}</span></div>}
        {data.lat != null && <div className="node-field"><span className="field-key">Koord.</span><span className="field-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>{data.lat.toFixed(4)}, {data.lng.toFixed(4)}</span></div>}
        {data.timestamp && <div className="node-field"><span className="field-key">Zaman</span><span className="field-val">{new Date(data.timestamp).toLocaleString('tr-TR')}</span></div>}
        {data.notes && <div className="node-notes">{data.notes}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: 'var(--node-location)', border: 'none', width: 8, height: 8 }} />
    </div>
  );
}
