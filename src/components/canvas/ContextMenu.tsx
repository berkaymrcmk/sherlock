import { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useGraphStore } from '../../store/graphStore';
import type { NodeType } from '../../types';

const NODE_ITEMS: { type: NodeType; label: string; icon: string; color: string }[] = [
  { type: 'person',        label: 'Şahıs Ekle',         icon: '👤', color: 'var(--node-person)'        },
  { type: 'vehicle',       label: 'Araç Ekle',           icon: '🚗', color: 'var(--node-vehicle)'       },
  { type: 'communication', label: 'İletişim/Cihaz Ekle', icon: '📱', color: 'var(--node-communication)' },
  { type: 'location',      label: 'Lokasyon Ekle',       icon: '📍', color: 'var(--node-location)'      },
  { type: 'evidence',      label: 'Kanıt/Belge Ekle',    icon: '📁', color: 'var(--node-evidence)'      },
  { type: 'note',          label: 'Not Kağıdı Ekle',     icon: '📝', color: 'var(--node-note)'          },
];

interface NodeContextMenuProps {
  nodeId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export function NodeContextMenu({ nodeId, x, y, onClose }: NodeContextMenuProps) {
  const { showNodeForm } = useUIStore();
  const { deleteNode, getNodeById } = useGraphStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const node = getNodeById(nodeId);
  if (!node) return null;

  const handleEdit = () => {
    showNodeForm({ mode: 'edit', nodeType: node.type as any, nodeId });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`"${node.data.label}" düğümü ve ilişkili tüm bağlantılar silinecek. Emin misiniz?`)) {
      deleteNode(nodeId);
    }
    onClose();
  };

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: x, top: y, minWidth: 180 }}
    >
      <div className="context-menu-title">{node.data.label}</div>
      <div className="context-menu-item" onClick={handleEdit}>
        <span>✏️</span> Düzenle
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item" onClick={handleDelete} style={{ color: 'var(--status-speculative)' }}>
        <span>🗑️</span> Sil
      </div>
    </div>
  );
}

// ─── Canvas sağ tık menüsü (boş alan) ────────────────────────────────────────

export function CanvasContextMenu() {
  const { contextMenu, hideContextMenu, showNodeForm } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) hideContextMenu();
    };
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [contextMenu.visible, hideContextMenu]);

  if (!contextMenu.visible) return null;

  const handleAddNode = (type: NodeType) => {
    hideContextMenu();
    showNodeForm({
      mode: 'add',
      nodeType: type,
      initialPosition: { x: contextMenu.flowX, y: contextMenu.flowY },
    });
  };

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      <div className="context-menu-title">Düğüm Ekle</div>
      {NODE_ITEMS.map(({ type, label, icon, color }) => (
        <div key={type} className="context-menu-item" onClick={() => handleAddNode(type)}>
          <span className="dot" style={{ background: color }} />
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
