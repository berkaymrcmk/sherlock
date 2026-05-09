import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin as MapPinIcon, Trash2, Send, Link, Copy, Route } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import type { PinType, MapPin } from '../../types';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PIN_COLORS: Record<PinType, string> = {
  crime_scene: '#ef4444', suspect_location: '#f59e0b',
  evidence: '#38bdf8', camera: '#8b5cf6', route_point: '#22c55e', other: '#6b7280',
};
const PIN_LABELS: Record<PinType, string> = {
  crime_scene: 'Olay Yeri', suspect_location: 'Şüpheli Konumu',
  evidence: 'Kanıt', camera: 'Kamera/Baz İst.', route_point: 'Güzergah Noktası', other: 'Diğer',
};

function createColorIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px ${color}88"></div>`,
    iconSize: [16, 16], iconAnchor: [8, 8],
  });
}

function MapClickHandler({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onAdd(e.latlng.lat, e.latlng.lng) });
  return null;
}

function PinFormModal({
  pin, onSave, onClose,
}: { pin: { lat: number; lng: number } | null; onSave: (d: Omit<MapPin, 'id'>) => void; onClose: () => void }) {
  const [label, setLabel]     = useState('');
  const [type, setType]       = useState<PinType>('other');
  const [timestamp, setTs]    = useState('');
  const [radius, setRadius]   = useState('');
  const [notes, setNotes]     = useState('');

  if (!pin) return null;

  const save = () => {
    onSave({
      lat: pin.lat, lng: pin.lng, label: label || 'Pin',
      pinType: type, timestamp: timestamp ? new Date(timestamp).toISOString() : undefined,
      radius: radius ? parseInt(radius) : undefined, notes: notes || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title"><MapPinIcon size={16} color="var(--node-location)" />Pin Ekle</div>
        </div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Etiket *</label><input className="form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="örn: Cinayet Mahalli" autoFocus /></div>
          <div className="form-group"><label className="form-label">Pin Tipi</label>
            <select className="form-select" value={type} onChange={e => setType(e.target.value as PinType)}>
              {(Object.keys(PIN_LABELS) as PinType[]).map(k => <option key={k} value={k}>{PIN_LABELS[k]}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Tarih / Saat</label><input className="form-input" type="datetime-local" value={timestamp} onChange={e => setTs(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Kapsam Yarıçapı (m)</label><input className="form-input" type="number" value={radius} onChange={e => setRadius(e.target.value)} placeholder="örn: 500" /></div>
          </div>
          <div className="form-group"><label className="form-label">Koordinat</label><input className="form-input" value={`${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`} readOnly style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} /></div>
          <div className="form-group"><label className="form-label">Notlar</label><textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>İptal</button>
          <button className="btn btn-primary" onClick={save}>Ekle</button>
        </div>
      </div>
    </div>
  );
}

export function TacticalMap() {
  const { investigation, addMapPin, deleteMapPin, pinToNode, addMapLine, deleteMapLine } = useGraphStore();
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);

  const [clipboardPin, setClipboardPin] = useState<Omit<MapPin, 'id' | 'lat' | 'lng'> | null>(null);
  const [routeMode, setRouteMode] = useState(false);
  const [lastRoutePinId, setLastRoutePinId] = useState<string | null>(null);

  const handleCopyPin = (pin: MapPin) => {
    setClipboardPin({
      label: pin.label,
      pinType: pin.pinType,
      radius: pin.radius,
      notes: pin.notes,
      timestamp: pin.timestamp
    });
    setAddMode(true);
    setConnectMode(false);
    setRouteMode(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (routeMode) {
      const newPin = addMapPin({ lat, lng, label: 'Güzergah Noktası', pinType: 'route_point' });
      if (lastRoutePinId) {
        addMapLine({ sourcePinId: lastRoutePinId, targetPinId: newPin.id, color: '#22c55e' });
      }
      setLastRoutePinId(newPin.id);
    } else if (addMode) {
      if (clipboardPin) {
        addMapPin({ ...clipboardPin, lat, lng });
        setClipboardPin(null);
        setAddMode(false);
      } else {
        setPendingPin({ lat, lng });
        setAddMode(false);
      }
    }
  };

  const handleMarkerClick = (pinId: string) => {
    if (connectMode) {
      if (!connectSourceId) {
        setConnectSourceId(pinId);
      } else if (connectSourceId !== pinId) {
        addMapLine({ sourcePinId: connectSourceId, targetPinId: pinId, color: '#1a7ed4' });
        setConnectSourceId(null);
        setConnectMode(false);
      } else {
        setConnectSourceId(null);
      }
    }
  };

  return (
    <div className="map-container">
      <div className="map-toolbar">
        <button
          className={`map-tool-btn ${addMode ? 'active' : ''}`}
          onClick={() => { setAddMode(v => !v); setConnectMode(false); setRouteMode(false); setClipboardPin(null); }}
        >
          <MapPinIcon size={13} />
          {addMode ? (clipboardPin ? 'Kopya Yapıştırılıyor' : 'Pin Modu Aktif') : 'Pin Ekle'}
        </button>
        <button
          className={`map-tool-btn ${connectMode ? 'active' : ''}`}
          onClick={() => { setConnectMode(v => !v); setAddMode(false); setRouteMode(false); setConnectSourceId(null); }}
        >
          <Link size={13} />
          {connectMode ? (connectSourceId ? 'Hedef Seç' : 'Bağlantı Modu Aktif') : 'Pinleri Bağla'}
        </button>
        <button
          className={`map-tool-btn ${routeMode ? 'active' : ''}`}
          onClick={() => { setRouteMode(v => !v); setAddMode(false); setConnectMode(false); setLastRoutePinId(null); }}
        >
          <Route size={13} />
          {routeMode ? 'Güzergah Çiziliyor' : 'Güzergah Çiz'}
        </button>
        <div style={{ width: 1, background: 'var(--border-dim)', margin: '4px 0' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 6px' }}>
          {investigation.mapPins.length} pin
        </span>
      </div>

      <MapContainer
        center={[39.9334, 32.8597]}
        zoom={6}
        style={{ width: '100%', height: '100%', background: 'var(--bg-base)', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="Google Maps"
          maxZoom={20}
          keepBuffer={4}
        />

        {(addMode || routeMode) && <MapClickHandler onAdd={handleMapClick} />}

        {investigation.mapPins.map(pin => {
          const isSource = connectSourceId === pin.id;
          return (
            <div key={pin.id}>
              <Marker
                position={[pin.lat, pin.lng]}
                icon={createColorIcon(isSource ? '#1a7ed4' : PIN_COLORS[pin.pinType])}
                eventHandlers={{ click: () => handleMarkerClick(pin.id) }}
              >
                {!connectMode && (
                  <Popup>
                    <div style={{ fontFamily: 'var(--font-ui)', minWidth: 160 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{pin.label}</div>
                      <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{PIN_LABELS[pin.pinType]}</div>
                      {pin.timestamp && <div style={{ fontSize: 10, color: '#888' }}>{new Date(pin.timestamp).toLocaleString('tr-TR')}</div>}
                      {pin.notes && <div style={{ fontSize: 11, marginTop: 4, borderTop: '1px solid #eee', paddingTop: 4 }}>{pin.notes}</div>}
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        <button onClick={() => pinToNode(pin.id)} style={{ flex: 1, fontSize: 10, padding: '3px 6px', background: '#1a7ed4', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                          <Send size={10} /> Canvas
                        </button>
                        <button onClick={() => handleCopyPin(pin)} style={{ flex: 1, fontSize: 10, padding: '3px 6px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-dim)', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                          <Copy size={10} /> Kopyala
                        </button>
                        <button onClick={() => deleteMapPin(pin.id)} style={{ padding: '3px 6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  </Popup>
                )}
              </Marker>
              {pin.radius && <Circle center={[pin.lat, pin.lng]} radius={pin.radius} pathOptions={{ color: PIN_COLORS[pin.pinType], fillOpacity: 0.08, weight: 1 }} />}
            </div>
          );
        })}

        {(investigation.mapLines || []).map(line => {
          const source = investigation.mapPins.find(p => p.id === line.sourcePinId);
          const target = investigation.mapPins.find(p => p.id === line.targetPinId);
          if (!source || !target) return null;
          return (
            <Polyline
              key={line.id}
              positions={[[source.lat, source.lng], [target.lat, target.lng]]}
              pathOptions={{ color: line.color || '#1a7ed4', weight: 3, opacity: 0.8, dashArray: '5, 5' }}
              eventHandlers={{
                click: () => { if(window.confirm('Bağlantıyı silmek istiyor musunuz?')) deleteMapLine(line.id); }
              }}
            />
          );
        })}
      </MapContainer>

      <div className="pin-sidebar">
        <div className="pin-sidebar-header">📍 Pinler ({investigation.mapPins.length})</div>
        <div className="pin-list">
          {investigation.mapPins.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 'var(--space-md)', textAlign: 'center' }}>
              "Pin Ekle" butonuna tıklayın ve haritada bir konuma tıklayın.
            </div>
          )}
          {investigation.mapPins.map(pin => (
            <div key={pin.id} className="pin-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIN_COLORS[pin.pinType], flexShrink: 0 }} />
                <div>
                  <div className="pin-item-label">{pin.label}</div>
                  <div className="pin-item-type">{PIN_LABELS[pin.pinType]}</div>
                  {pin.timestamp && <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{new Date(pin.timestamp).toLocaleString('tr-TR')}</div>}
                </div>
              </div>
              <div className="pin-item-actions">
                <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => handleCopyPin(pin)}>
                  <Copy size={10} />
                </button>
                <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => pinToNode(pin.id)}>
                  <Send size={10} /> Canvas
                </button>
                <button className="btn btn-danger" style={{ fontSize: 10, padding: '3px 6px' }} onClick={() => deleteMapPin(pin.id)}>
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pendingPin && (
        <PinFormModal
          pin={pendingPin}
          onSave={data => addMapPin(data)}
          onClose={() => setPendingPin(null)}
        />
      )}
    </div>
  );
}
