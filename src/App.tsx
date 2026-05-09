import { useEffect, useState } from 'react';
import { CheckCircle }        from 'lucide-react';
import { Sidebar }           from './components/layout/Sidebar';
import { AppHeader }          from './components/layout/AppHeader';
import { InvestigationCanvas } from './components/canvas/InvestigationCanvas';
import { TacticalMap }        from './components/map/TacticalMap';
import { CustomTimeline }     from './components/timeline/CustomTimeline';
import { AIAssistant }        from './components/chat/AIAssistant';
import { useUIStore }         from './store/uiStore';

export default function App() {
  const { activeModule } = useUIStore();
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveToast(true);
        const timer = setTimeout(() => setShowSaveToast(false), 2000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <AppHeader />

        <div className="module-container">
          {/* Canvas — always mounted for React Flow state continuity */}
          <div style={{ width: '100%', height: '100%', display: activeModule === 'canvas' ? 'block' : 'none', position: 'relative' }}>
            <InvestigationCanvas />
          </div>

          {activeModule === 'map' && (
            <div style={{ width: '100%', height: '100%' }}>
              <TacticalMap />
            </div>
          )}

          {activeModule === 'chat' && (
            <div style={{ width: '100%', height: '100%' }}>
              <AIAssistant />
            </div>
          )}

          {activeModule === 'timeline' && (
            <div style={{ width: '100%', height: '100%', background: 'var(--bg-base)' }}>
              <CustomTimeline />
            </div>
          )}
        </div>
      </div>

      {showSaveToast && (
        <div className="save-toast">
          <CheckCircle size={16} color="var(--status-confirmed)" />
          <span>Soruşturma kaydedildi!</span>
        </div>
      )}
    </div>
  );
}
