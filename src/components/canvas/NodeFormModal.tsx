import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import type {
  NodeType, AnyNodeData, SuspectRole,
  PersonNodeData, VehicleNodeData, CommunicationNodeData,
  LocationNodeData, EvidenceNodeData,
} from '../../types';

const NODE_TITLES: Record<NodeType, string> = {
  person: 'Şahıs', vehicle: 'Araç', communication: 'İletişim / Cihaz',
  location: 'Lokasyon', evidence: 'Kanıt / Belge', note: 'Not Kağıdı',
};
const NODE_ICONS: Record<NodeType, string> = {
  person: '👤', vehicle: '🚗', communication: '📱', location: '📍', evidence: '📁', note: '📝',
};

function ImageUpload({ photoUrl, onChange }: { photoUrl?: string; onChange: (url: string) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Fotoğraf Yükle (Bilgisayardan)</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ flex: 1, padding: '4px' }} />
        {photoUrl && (
          <div style={{ width: 28, height: 28, borderRadius: 4, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-dim)' }}>
            <img src={photoUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
}

function PersonForm({ data, onChange }: { data: Partial<PersonNodeData>; onChange: (d: Partial<PersonNodeData>) => void }) {
  return <>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Ad Soyad *</label><input className="form-input" value={data.fullName ?? ''} onChange={e => onChange({ ...data, fullName: e.target.value, label: e.target.value })} placeholder="Ahmet Yılmaz" /></div>
      <div className="form-group"><label className="form-label">TCKN</label><input className="form-input" value={data.nationalId ?? ''} onChange={e => onChange({ ...data, nationalId: e.target.value })} placeholder="12345678901" maxLength={11} /></div>
    </div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Doğum Tarihi</label><input className="form-input" type="date" value={data.birthDate ?? ''} onChange={e => onChange({ ...data, birthDate: e.target.value })} /></div>
      <div className="form-group"><label className="form-label">Rol *</label>
        <select className="form-select" value={data.role ?? 'unknown'} onChange={e => onChange({ ...data, role: e.target.value as SuspectRole })}>
          <option value="suspect">Şüpheli</option><option value="witness">Tanık</option>
          <option value="victim">Mağdur</option><option value="unknown">Bilinmiyor</option>
        </select>
      </div>
    </div>
    <ImageUpload photoUrl={data.photoUrl} onChange={url => onChange({ ...data, photoUrl: url })} />
    <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={data.notes ?? ''} onChange={e => onChange({ ...data, notes: e.target.value })} placeholder="Ek bilgiler..." /></div>
  </>;
}

function VehicleForm({ data, onChange }: { data: Partial<VehicleNodeData>; onChange: (d: Partial<VehicleNodeData>) => void }) {
  return <>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Plaka *</label><input className="form-input" value={data.plate ?? ''} onChange={e => onChange({ ...data, plate: e.target.value.toUpperCase(), label: e.target.value.toUpperCase() })} placeholder="34 ABC 123" /></div>
      <div className="form-group"><label className="form-label">Renk</label><input className="form-input" value={data.color ?? ''} onChange={e => onChange({ ...data, color: e.target.value })} placeholder="Siyah" /></div>
    </div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Marka</label><input className="form-input" value={data.brand ?? ''} onChange={e => onChange({ ...data, brand: e.target.value })} placeholder="Renault" /></div>
      <div className="form-group"><label className="form-label">Model</label><input className="form-input" value={data.model ?? ''} onChange={e => onChange({ ...data, model: e.target.value })} placeholder="Megane" /></div>
    </div>
    <ImageUpload photoUrl={data.photoUrl} onChange={url => onChange({ ...data, photoUrl: url })} />
    <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={data.notes ?? ''} onChange={e => onChange({ ...data, notes: e.target.value })} placeholder="Ek bilgiler..." /></div>
  </>;
}

function CommunicationForm({ data, onChange }: { data: Partial<CommunicationNodeData>; onChange: (d: Partial<CommunicationNodeData>) => void }) {
  return <>
    <div className="form-group"><label className="form-label">Etiket *</label><input className="form-input" value={data.label ?? ''} onChange={e => onChange({ ...data, label: e.target.value })} placeholder="örn: Şüpheli Telefonu" /></div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Telefon Numarası</label><input className="form-input" value={data.phoneNumber ?? ''} onChange={e => onChange({ ...data, phoneNumber: e.target.value })} placeholder="+90 5XX XXX XX XX" /></div>
      <div className="form-group"><label className="form-label">Operatör</label><input className="form-input" value={data.carrier ?? ''} onChange={e => onChange({ ...data, carrier: e.target.value })} placeholder="Turkcell" /></div>
    </div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">IMEI</label><input className="form-input" value={data.imei ?? ''} onChange={e => onChange({ ...data, imei: e.target.value })} placeholder="35XXXXX..." /></div>
      <div className="form-group"><label className="form-label">IP Adresi</label><input className="form-input" value={data.ipAddress ?? ''} onChange={e => onChange({ ...data, ipAddress: e.target.value })} placeholder="192.168.x.x" /></div>
    </div>
    <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" value={data.email ?? ''} onChange={e => onChange({ ...data, email: e.target.value })} placeholder="ornek@email.com" /></div>
    <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={data.notes ?? ''} onChange={e => onChange({ ...data, notes: e.target.value })} /></div>
  </>;
}

function LocationForm({ data, onChange }: { data: Partial<LocationNodeData>; onChange: (d: Partial<LocationNodeData>) => void }) {
  return <>
    <div className="form-group"><label className="form-label">Etiket *</label><input className="form-input" value={data.label ?? ''} onChange={e => onChange({ ...data, label: e.target.value })} placeholder="örn: Cinayet Mahalli" /></div>
    <div className="form-group"><label className="form-label">Adres</label><input className="form-input" value={data.address ?? ''} onChange={e => onChange({ ...data, address: e.target.value })} placeholder="Tam adres..." /></div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Enlem</label><input className="form-input" type="number" step="any" value={data.lat ?? ''} onChange={e => onChange({ ...data, lat: parseFloat(e.target.value) })} placeholder="41.0082" /></div>
      <div className="form-group"><label className="form-label">Boylam</label><input className="form-input" type="number" step="any" value={data.lng ?? ''} onChange={e => onChange({ ...data, lng: parseFloat(e.target.value) })} placeholder="28.9784" /></div>
    </div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Lokasyon Tipi</label>
        <select className="form-select" value={data.locationType ?? 'other'} onChange={e => onChange({ ...data, locationType: e.target.value as LocationNodeData['locationType'] })}>
          <option value="crime_scene">Olay Yeri</option><option value="residence">İkametgah</option>
          <option value="workplace">İş Yeri</option><option value="transit">Güzergah</option><option value="other">Diğer</option>
        </select>
      </div>
      <div className="form-group"><label className="form-label">Olay Zamanı</label><input className="form-input" type="datetime-local" value={data.timestamp?.slice(0, 16) ?? ''} onChange={e => onChange({ ...data, timestamp: new Date(e.target.value).toISOString() })} /></div>
    </div>
    <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={data.notes ?? ''} onChange={e => onChange({ ...data, notes: e.target.value })} /></div>
  </>;
}

function EvidenceForm({ data, onChange }: { data: Partial<EvidenceNodeData>; onChange: (d: Partial<EvidenceNodeData>) => void }) {
  return <>
    <div className="form-group"><label className="form-label">Etiket *</label><input className="form-input" value={data.label ?? ''} onChange={e => onChange({ ...data, label: e.target.value })} placeholder="örn: Tabanca (9mm)" /></div>
    <div className="form-group"><label className="form-label">Kanıt Tipi</label>
      <select className="form-select" value={data.evidenceType ?? 'physical'} onChange={e => onChange({ ...data, evidenceType: e.target.value as EvidenceNodeData['evidenceType'] })}>
        <option value="statement">İfade Tutanağı</option><option value="forensic_report">Adli Tıp Raporu</option>
        <option value="weapon">Silah</option><option value="digital">Dijital Delil</option><option value="physical">Fiziksel Delil</option>
      </select>
    </div>
    <div className="form-row">
      <div className="form-group"><label className="form-label">Dosya No</label><input className="form-input" value={data.caseNumber ?? ''} onChange={e => onChange({ ...data, caseNumber: e.target.value })} /></div>
      <div className="form-group"><label className="form-label">Toplayan</label><input className="form-input" value={data.collectedBy ?? ''} onChange={e => onChange({ ...data, collectedBy: e.target.value })} /></div>
    </div>
    <div className="form-group"><label className="form-label">Toplama Tarihi</label><input className="form-input" type="datetime-local" value={data.collectedAt?.slice(0, 16) ?? ''} onChange={e => onChange({ ...data, collectedAt: new Date(e.target.value).toISOString() })} /></div>
    <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={data.notes ?? ''} onChange={e => onChange({ ...data, notes: e.target.value })} /></div>
  </>;
}

function NoteForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return <>
    <div className="form-group"><label className="form-label">Başlık</label><input className="form-input" value={data.label ?? ''} onChange={e => onChange({ ...data, label: e.target.value })} placeholder="Kısa başlık..." autoFocus /></div>
    <div className="form-group"><label className="form-label">Not İçeriği *</label><textarea className="form-textarea" style={{ minHeight: 120 }} value={data.text ?? ''} onChange={e => onChange({ ...data, text: e.target.value })} placeholder="Notlarınızı buraya yazın..." /></div>
    <div className="form-group"><label className="form-label">Renk</label>
      <div style={{ display: 'flex', gap: 8 }}>
        {['#fef08a', '#fbcfe8', '#bae6fd', '#bbf7d0', '#e2e8f0'].map(c => (
          <div key={c} onClick={() => onChange({ ...data, color: c })} style={{ width: 24, height: 24, borderRadius: 4, background: c, border: data.color === c ? '2px solid #333' : '1px solid #ccc', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  </>;
}

const DEFAULT_DATA: Record<NodeType, Partial<AnyNodeData>> = {
  person:        { type: 'person',        role: 'unknown', threatLevel: 1, fullName: '', nationalId: '', birthDate: '', label: '' },
  vehicle:       { type: 'vehicle',       plate: '', brand: '', model: '', color: '', label: '' },
  communication: { type: 'communication', label: '' },
  location:      { type: 'location',      label: '', address: '', lat: 0, lng: 0, locationType: 'other' },
  evidence:      { type: 'evidence',      label: '', evidenceType: 'physical' },
  note:          { type: 'note',          label: '', text: '', color: '#fef08a' },
};

export function NodeFormModal() {
  const { nodeForm, hideNodeForm } = useUIStore();
  const { addNode, updateNodeData, getNodeById } = useGraphStore();
  const [formData, setFormData] = useState<Partial<AnyNodeData>>({});

  useEffect(() => {
    if (!nodeForm.visible) return;
    if (nodeForm.mode === 'edit' && nodeForm.nodeId) {
      const node = getNodeById(nodeForm.nodeId);
      if (node) setFormData({ ...node.data });
    } else if (nodeForm.nodeType) {
      setFormData({ ...DEFAULT_DATA[nodeForm.nodeType] });
    }
  }, [nodeForm.visible, nodeForm.mode, nodeForm.nodeId, nodeForm.nodeType]);

  if (!nodeForm.visible || !nodeForm.nodeType) return null;

  const handleSubmit = () => {
    if (!formData.type) return;
    if (nodeForm.mode === 'add') {
      addNode(nodeForm.nodeType!, formData as AnyNodeData, nodeForm.initialPosition ?? { x: 200, y: 200 });
    } else if (nodeForm.nodeId) {
      updateNodeData(nodeForm.nodeId, formData);
    }
    hideNodeForm();
  };

  const nodeType = nodeForm.nodeType;
  const color = `var(--node-${nodeType})`;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) hideNodeForm(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ fontSize: 20 }}>{NODE_ICONS[nodeType]}</span>
            <span style={{ color }}>{NODE_TITLES[nodeType]}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
              {nodeForm.mode === 'edit' ? 'Düzenle' : 'Ekle'}
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={hideNodeForm}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {nodeType === 'person'        && <PersonForm        data={formData as Partial<PersonNodeData>}        onChange={d => setFormData(d)} />}
          {nodeType === 'vehicle'       && <VehicleForm       data={formData as Partial<VehicleNodeData>}       onChange={d => setFormData(d)} />}
          {nodeType === 'communication' && <CommunicationForm data={formData as Partial<CommunicationNodeData>} onChange={d => setFormData(d)} />}
          {nodeType === 'location'      && <LocationForm      data={formData as Partial<LocationNodeData>}      onChange={d => setFormData(d)} />}
          {nodeType === 'evidence'      && <EvidenceForm      data={formData as Partial<EvidenceNodeData>}      onChange={d => setFormData(d)} />}
          {nodeType === 'note'          && <NoteForm          data={formData}                                   onChange={d => setFormData(d)} />}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={hideNodeForm}>İptal</button>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ background: color }}>
            {nodeForm.mode === 'edit' ? 'Kaydet' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}
