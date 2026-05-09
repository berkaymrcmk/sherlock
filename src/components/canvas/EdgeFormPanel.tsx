import { useState, useEffect } from 'react';
import { X, Link2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import type { RelationType, ConfidenceLevel } from '../../types';
import { RELATION_LABELS, CONFIDENCE_LABELS } from '../../types';

export function EdgeFormPanel() {
  const { edgeForm, hideEdgeForm } = useUIStore();
  const { addEdge, updateEdge, getEdgeById, getNodeById } = useGraphStore();

  const [relType, setRelType]     = useState<RelationType>('associate_of');
  const [customLabel, setCustom]  = useState('');
  const [confidence, setConf]     = useState<ConfidenceLevel>('probable');
  const [timestamp, setTimestamp] = useState('');
  const [bidirectional, setBidir] = useState(false);
  const [notes, setNotes]         = useState('');

  useEffect(() => {
    if (!edgeForm.visible) return;
    if (edgeForm.edgeId) {
      const e = getEdgeById(edgeForm.edgeId);
      if (e) {
        setRelType(e.relationType); setCustom(e.customLabel ?? '');
        setConf(e.confidence); setTimestamp(e.timestamp?.slice(0, 16) ?? '');
        setBidir(e.bidirectional); setNotes(e.notes ?? '');
      }
    } else {
      setRelType('associate_of'); setCustom(''); setConf('probable');
      setTimestamp(''); setBidir(false); setNotes('');
    }
  }, [edgeForm.visible, edgeForm.edgeId]);

  if (!edgeForm.visible) return null;

  const srcNode = edgeForm.sourceId ? getNodeById(edgeForm.sourceId) : null;
  const tgtNode = edgeForm.targetId ? getNodeById(edgeForm.targetId) : null;

  const handleSave = () => {
    const payload = {
      source: edgeForm.sourceId!,
      target: edgeForm.targetId!,
      relationType: relType,
      customLabel: relType === 'custom' ? customLabel : undefined,
      confidence,
      timestamp: timestamp ? new Date(timestamp).toISOString() : undefined,
      bidirectional,
      notes: notes || undefined,
    };
    if (edgeForm.edgeId) updateEdge(edgeForm.edgeId, payload);
    else addEdge(payload);
    hideEdgeForm();
  };

  return (
    <div className="edge-panel">
      <div className="edge-panel-title">
        <Link2 size={14} color="var(--accent-glow)" />
        İlişki {edgeForm.edgeId ? 'Düzenle' : 'Tanımla'}
        <button className="btn btn-ghost btn-icon" style={{ marginLeft: 'auto' }} onClick={hideEdgeForm}><X size={12} /></button>
      </div>

      {srcNode && tgtNode && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{srcNode.data.label}</span>
          <span>→</span>
          <span style={{ color: 'var(--text-secondary)' }}>{tgtNode.data.label}</span>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
        <label className="form-label">İlişki Tipi</label>
        <select className="form-select" value={relType} onChange={e => setRelType(e.target.value as RelationType)}>
          {(Object.keys(RELATION_LABELS) as RelationType[]).map(k => (
            <option key={k} value={k}>{RELATION_LABELS[k]}</option>
          ))}
        </select>
      </div>

      {relType === 'custom' && (
        <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
          <label className="form-label">Özel Etiket</label>
          <input className="form-input" value={customLabel} onChange={e => setCustom(e.target.value)} placeholder="İlişkiyi tanımlayın..." />
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
        <label className="form-label">Güven Seviyesi</label>
        <div className="confidence-buttons">
          {(['confirmed', 'probable', 'speculative'] as ConfidenceLevel[]).map(c => (
            <div key={c} className={`confidence-btn ${confidence === c ? 'active' : ''}`} data-v={c} onClick={() => setConf(c)}>
              {CONFIDENCE_LABELS[c]}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 'var(--space-sm)' }}>
        <label className="form-label">Tarih / Saat</label>
        <input className="form-input" type="datetime-local" value={timestamp} onChange={e => setTimestamp(e.target.value)} />
      </div>

      <div className="form-group" style={{ marginBottom: 'var(--space-sm)', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <input type="checkbox" id="bidir" checked={bidirectional} onChange={e => setBidir(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
        <label htmlFor="bidir" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Çift Yönlü</label>
      </div>

      <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
        <label className="form-label">Notlar</label>
        <textarea className="form-textarea" style={{ minHeight: 50 }} value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={hideEdgeForm}>İptal</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Kaydet</button>
      </div>
    </div>
  );
}
