import { useMemo } from 'react';
import { useGraphStore } from '../../store/graphStore';
import './CustomTimeline.css';

interface TimelineEvent {
  id: string;
  dateStr: string;
  dateObj: Date;
  label: string;
  type: string;
  color: string;
  description?: string;
}

export function CustomTimeline() {
  const { investigation } = useGraphStore();

  const sortedGroups = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Düğümleri tara
    investigation.nodes.forEach(node => {
      const d = node.data as any;
      const dateVal = d.timestamp || d.collectedAt || d.birthDate;
      if (dateVal) {
        events.push({
          id: `node-${node.id}`,
          dateStr: dateVal,
          dateObj: new Date(dateVal),
          label: d.label || d.fullName || d.plate || 'Bilinmeyen',
          type: node.type,
          color: `var(--node-${node.type})`,
          description: d.notes,
        });
      }
    });

    // Bağlantıları tara
    investigation.edges.forEach(edge => {
      if (edge.timestamp) {
        const src = investigation.nodes.find(n => n.id === edge.source);
        const tgt = investigation.nodes.find(n => n.id === edge.target);
        events.push({
          id: `edge-${edge.id}`,
          dateStr: edge.timestamp,
          dateObj: new Date(edge.timestamp),
          label: `${src?.data.label || '?'} → ${tgt?.data.label || '?'}`,
          type: 'relation',
          color: 'var(--accent-primary)',
          description: edge.notes,
        });
      }
    });

    // Gün bazında grupla
    const grouped = events.reduce((acc, event) => {
      const dateKey = event.dateObj.toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, TimelineEvent[]>);

    // Kronolojik olarak sırala
    return Object.keys(grouped).sort((a, b) => {
      return grouped[a][0].dateObj.getTime() - grouped[b][0].dateObj.getTime();
    }).map(key => ({
      dateKey: key,
      events: grouped[key]
    }));
  }, [investigation.nodes, investigation.edges]);

  if (sortedGroups.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Zaman çizelgesinde gösterilecek olay bulunamadı. Düğümlere veya bağlantılara tarih bilgisi ekleyin.
      </div>
    );
  }

  return (
    <div className="custom-timeline-wrapper">
      <div className="custom-timeline-scroll">
        <div className="timeline-main-line"></div>
        <div className="timeline-groups-container">
          {sortedGroups.map((group) => (
            <div className="timeline-group" key={group.dateKey}>
              <div className="timeline-date-label">{group.dateKey}</div>
              <div className="timeline-dot"></div>
              
              <div className="timeline-events-branch">
                {/* Merkezdeki ince bağlantı çizgisi */}
                <div className="timeline-vertical-stem"></div>
                
                {group.events
                  .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
                  .map((event) => {
                    const timeStr = event.dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    // Eğer saat "00:00" ise veya hiç saat girilmemişse göstermemek tercih edilebilir, ama şimdilik gösterelim.
                    return (
                      <div className="timeline-event-wrapper" key={event.id}>
                        <div className="event-time-label">{timeStr}</div>
                        <div className="timeline-event-box" style={{ borderLeftColor: event.color }}>
                          <div className="event-type-badge" style={{ color: event.color }}>
                            {event.type.toUpperCase()}
                          </div>
                          <div className="event-title">{event.label}</div>
                          {event.description && <div className="event-desc">{event.description}</div>}
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
