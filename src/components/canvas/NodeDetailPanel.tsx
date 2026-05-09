import { X, Pencil, Trash2, Link2, User, Car, Smartphone, MapPin, FileText } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import { useUIStore }    from '../../store/uiStore';
import type { GraphNode, AnyNodeData } from '../../types';
import { RELATION_LABELS } from '../../types';

const NODE_ICONS: Record<string, React.ReactNode> = {
  person:        <User        size={14} />,
  vehicle:       <Car         size={14} />,
  communication: <Smartphone  size={14} />,
  location:      <MapPin      size={14} />,
  evidence:      <FileText    size={14} />,
};
const NODE_COLORS: Record<string, string> = {
  person: 'var(--node-person)', vehicle: 'var(--node-vehicle)',
  communication: 'var(--node-communication)', location: 'var(--node-location)',
  evidence: 'var(--node-evidence)',
};
const ROLE_TR: Record<string, string> = {
  suspect: 'Şüpheli', witness: 'Tanık', victim: 'Mağdur', unknown: 'Bilinmiyor',
};
const LOC_TYPE_TR: Record<string, string> = {
  crime_scene: 'Olay Yeri', residence: 'İkametgah', workplace: 'İş Yeri',
  transit: 'Güzergah', other: 'Diğer',
};
const EV_TYPE_TR: Record<string, string> = {
  statement: 'İfade Tutanağı', forensic_report: 'Adli Tıp Raporu',
  weapon: 'Silah', digital: 'Dijital Delil', physical: 'Fiziksel Delil',
};

function NodeFields({ node }: { node: GraphNode }) {
  const d = node.data as AnyNodeData & Record<string, unknown>;
  const fields: { key: string; val: string | undefined }[] = [];

  if (node.type === 'person') {
    const p = d as any;
    fields.push(
      { key: 'Rol', val: ROLE_TR[p.role] },
      { key: 'TCKN', val: p.nationalId },
      { key: 'Doğum Tarihi', val: p.birthDate },
    );
  } else if (node.type === 'vehicle') {
    const v = d as any;
    fields.push(
      { key: 'Plaka', val: v.plate },
      { key: 'Marka / Model', val: `${v.brand} ${v.model}`.trim() },
      { key: 'Renk', val: v.color },
      { key: 'Yıl', val: v.year?.toString() },
    );
  } else if (node.type === 'communication') {
    const c = d as any;
    fields.push(
      { key: 'Telefon', val: c.phoneNumber },
      { key: 'IMEI', val: c.imei },
      { key: 'E-posta', val: c.email },
      { key: 'IP', val: c.ipAddress },
      { key: 'Operatör', val: c.carrier },
    );
  } else if (node.type === 'location') {
    const l = d as any;
    fields.push(
      { key: 'Tip', val: LOC_TYPE_TR[l.locationType] },
      { key: 'Adres', val: l.address },
      { key: 'Koordinat', val: l.lat ? `${l.lat.toFixed(5)}, ${l.lng.toFixed(5)}` : undefined },
      { key: 'Zaman', val: l.timestamp ? new Date(l.timestamp).toLocaleString('tr-TR') : undefined },
    );
  } else if (node.type === 'evidence') {
    const e = d as any;
    fields.push(
      { key: 'Tip', val: EV_TYPE_TR[e.evidenceType] },
      { key: 'Dosya No', val: e.caseNumber },
      { key: 'Toplayan', val: e.collectedBy },
      { key: 'Toplama', val: e.collectedAt ? new Date(e.collectedAt).toLocaleDateString('tr-TR') : undefined },
    );
  }

  return (
    <>
      {fields.filter(f => f.val).map(f => (
        <div key={f.key} className="node-field" style={{ padding: '3px 0', borderBottom: '1px solid var(--border-dim)' }}>
          <span className="field-key">{f.key}</span>
          <span className="field-val" style={{ fontFamily: f.key === 'TCKN' || f.key === 'IMEI' || f.key === 'IP' || f.key === 'Koordinat' ? 'var(--font-mono)' : 'var(--font-ui)', fontSize: 11 }}>{f.val}</span>
        </div>
      ))}
    </>
  );
}

export function NodeDetailPanel() {
  const { selectedNodeId, setSelectedNodeId, showNodeForm } = useUIStore();
  const { investigation, deleteNode } = useGraphStore();

  const node = selectedNodeId ? investigation.nodes.find(n => n.id === selectedNodeId) : null;

  if (!node) return null;

  const color = NODE_COLORS[node.type];
  const connectedEdges = investigation.edges.filter(
    e => e.source === node.id || e.target === node.id
  );

  const handleDelete = () => {
    if (confirm(`"${node.data.label}" düğümü ve ilişkili tüm bağlantılar silinecek. Emin misiniz?`)) {
      deleteNode(node.id);
      setSelectedNodeId(null);
    }
  };

  return (
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0,
      width: 280, zIndex: 'var(--z-ui)' as any,
      background: 'var(--bg-glass)', backdropFilter: 'blur(12px)',
      borderLeft: `1px solid ${color}44`,
      display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.2s ease',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: `1px solid ${color}33`,
        display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
      }}>
        <div style={{ color, flexShrink: 0 }}>{NODE_ICONS[node.type]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.data.label}</div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color }}>
            {node.type === 'person' ? 'Şahıs' : node.type === 'vehicle' ? 'Araç' : node.type === 'communication' ? 'İletişim' : node.type === 'location' ? 'Lokasyon' : 'Kanıt'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => showNodeForm({ mode: 'edit', nodeType: node.type as any, nodeId: node.id })}
            title="Düzenle"
          ><Pencil size={13} /></button>
          <button
            className="btn btn-danger btn-icon"
            onClick={handleDelete}
            title="Sil"
          ><Trash2 size={13} /></button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSelectedNodeId(null)}
            title="Kapat"
          ><X size={13} /></button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md) var(--space-lg)' }}>
        <NodeFields node={node} />

        {((node.data as any).notes || (node.data as any).text) && (
          <div style={{ marginTop: 'var(--space-sm)' }}>
            <div className="field-key" style={{ marginBottom: 3 }}>Notlar</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-overlay)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm)' }}>
              {String((node.data as any).notes || (node.data as any).text)}
            </div>
          </div>
        )}

        {/* Bağlantılar */}
        {connectedEdges.length > 0 && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link2 size={10} /> Bağlantılar ({connectedEdges.length})
            </div>
            {connectedEdges.map(edge => {
              const other = investigation.nodes.find(n => n.id === (edge.source === node.id ? edge.target : edge.source));
              const dir = edge.source === node.id ? '→' : '←';
              const confColor = edge.confidence === 'confirmed' ? 'var(--status-confirmed)' : edge.confidence === 'probable' ? 'var(--status-probable)' : 'var(--status-speculative)';
              return (
                <div key={edge.id} style={{
                  padding: '5px 8px', borderRadius: 'var(--radius-sm)', marginBottom: 4,
                  border: '1px solid var(--border-dim)', background: 'var(--bg-overlay)',
                  fontSize: 11,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{dir}</span>
                    <span style={{ fontWeight: 500, flex: 1 }}>{other?.data.label ?? '?'}</span>
                    <span style={{ fontSize: 8, color: confColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>●</span>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
                    {edge.customLabel || RELATION_LABELS[edge.relationType]}
                    {edge.timestamp && ` · ${new Date(edge.timestamp).toLocaleString('tr-TR')}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ekleme zamanı */}
        <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border-dim)' }}>
          <div className="node-field">
            <span className="field-key">Eklenme</span>
            <span className="field-val" style={{ fontSize: 10 }}>{new Date(node.createdAt).toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
