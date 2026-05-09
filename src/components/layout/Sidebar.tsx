import {
  Network, Map, Clock, Bot, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import type { ActiveModule } from '../../types';

const NAV_ITEMS: { id: ActiveModule; label: string; icon: React.ReactNode }[] = [
  { id: 'canvas',   label: 'Bağlantı Panosu', icon: <Network  size={16} /> },
  { id: 'map',      label: 'Taktiksel Harita', icon: <Map      size={16} /> },
  { id: 'timeline', label: 'Zaman Çizelgesi',  icon: <Clock    size={16} /> },
  { id: 'chat',     label: 'Dijital Analist',   icon: <Bot      size={16} /> },
];

export function Sidebar() {
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        {!sidebarCollapsed && (
          <div>
            <span className="logo-text">SHERLOCK</span>
            <span className="logo-sub">Kriminal İstihbarat</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {!sidebarCollapsed && <div className="sidebar-nav-section">Modüller</div>}
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeModule === item.id ? 'active' : ''}`}
            onClick={() => setActiveModule(item.id)}
            title={sidebarCollapsed ? item.label : undefined}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-nav-item"
          onClick={toggleSidebar}
          style={{ justifyContent: sidebarCollapsed ? 'center' : undefined }}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="nav-label">Daralt</span></>}
        </button>
      </div>
    </aside>
  );
}
