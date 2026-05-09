import { useState } from 'react';
import { FileText, X, Download, Copy, CheckCheck } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import { RELATION_LABELS, CONFIDENCE_LABELS } from '../../types';

export function ReportModal({ onClose }: { onClose: () => void }) {
  const { investigation } = useGraphStore();
  const [copied, setCopied] = useState(false);

  const now = new Date().toLocaleString('tr-TR');

  const buildReport = () => {
    const { title, caseNumber, nodes, edges } = investigation;

    const nodesByType: Record<string, typeof nodes> = {};
    nodes.forEach(n => { (nodesByType[n.type] = nodesByType[n.type] ?? []).push(n); });

    const typeLabelMap: Record<string, string> = {
      person: 'ŞAHISLAR', vehicle: 'ARAÇLAR', communication: 'İLETİŞİM/CİHAZLAR',
      location: 'LOKASYONLAR', evidence: 'KANITLAR/BELGELER',
    };

    let report = `POLİS SORUŞTURMA RAPORU\n`;
    report += `${'='.repeat(60)}\n`;
    report += `DAVA BAŞLIĞI  : ${title}\n`;
    if (caseNumber) report += `DAVA NUMARASI : ${caseNumber}\n`;
    report += `RAPOR TARİHİ  : ${now}\n`;
    report += `TOPLAM DÜĞÜM  : ${nodes.length} | TOPLAM İLİŞKİ: ${edges.length}\n`;
    report += `${'='.repeat(60)}\n\n`;

    // Modüller
    Object.entries(nodesByType).forEach(([type, list]) => {
      report += `\n${typeLabelMap[type] ?? type.toUpperCase()} (${list.length})\n`;
      report += `${'-'.repeat(40)}\n`;
      list.forEach(n => {
        const d = n.data as unknown as Record<string, unknown>;
        report += `  • ${d.label ?? d.fullName ?? d.plate}\n`;
        if (d.role) report += `    Rol: ${d.role === 'suspect' ? 'Şüpheli' : d.role === 'witness' ? 'Tanık' : d.role === 'victim' ? 'Mağdur' : 'Bilinmiyor'}\n`;
        if (d.nationalId) report += `    TCKN: ${d.nationalId}\n`;
        if (d.plate) report += `    Plaka: ${d.plate} | ${d.brand} ${d.model} (${d.color})\n`;
        if (d.phoneNumber) report += `    Telefon: ${d.phoneNumber}\n`;
        if (d.address) report += `    Adres: ${d.address}\n`;
        if (d.notes) report += `    Not: ${d.notes}\n`;
      });
    });

    // İlişkiler
    if (edges.length > 0) {
      report += `\n\nİLİŞKİLER VE BAĞLANTILAR (${edges.length})\n`;
      report += `${'-'.repeat(40)}\n`;
      edges.forEach(e => {
        const src = nodes.find(n => n.id === e.source);
        const tgt = nodes.find(n => n.id === e.target);
        const arrow = e.bidirectional ? '↔' : '→';
        const rel = e.customLabel || RELATION_LABELS[e.relationType];
        const conf = CONFIDENCE_LABELS[e.confidence];
        report += `  • ${src?.data.label ?? '?'} ${arrow} ${tgt?.data.label ?? '?'}\n`;
        report += `    İlişki: ${rel} | Güven: ${conf}`;
        if (e.timestamp) report += ` | Tarih: ${new Date(e.timestamp).toLocaleString('tr-TR')}`;
        if (e.notes) report += `\n    Not: ${e.notes}`;
        report += '\n';
      });
    }

    // Harita pinleri
    if (investigation.mapPins.length > 0) {
      const pinLabels: Record<string, string> = {
        crime_scene: 'Olay Yeri', suspect_location: 'Şüpheli Konumu',
        evidence: 'Kanıt', camera: 'Kamera/Baz İst.', route_point: 'Güzergah Noktası', other: 'Diğer',
      };
      report += `\n\nHARİTA PİNLERİ (${investigation.mapPins.length})\n`;
      report += `${'-'.repeat(40)}\n`;
      investigation.mapPins.forEach(p => {
        report += `  • ${p.label} [${pinLabels[p.pinType]}] — ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}\n`;
        if (p.timestamp) report += `    Zaman: ${new Date(p.timestamp).toLocaleString('tr-TR')}\n`;
        if (p.notes) report += `    Not: ${p.notes}\n`;
      });
    }

    report += `\n${'='.repeat(60)}\n`;
    report += `Bu rapor SHERLOCK Kriminal İstihbarat Platformu tarafından ${now} tarihinde otomatik oluşturulmuştur.\n`;

    return report;
  };

  const report = buildReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sherlock-rapor-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 660, maxHeight: '85vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={16} color="var(--accent-glow)" />
            Soruşturma Raporu
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost" onClick={handleCopy}>
              {copied ? <><CheckCheck size={13} color="var(--status-confirmed)" /> Kopyalandı</> : <><Copy size={13} /> Kopyala</>}
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              <Download size={13} /> İndir (.txt)
            </button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={14} /></button>
          </div>
        </div>
        <div style={{ padding: 'var(--space-lg)', overflowY: 'auto', flex: 1 }}>
          <pre style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
            color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            background: 'var(--bg-surface)', border: '1px solid var(--border-dim)',
            borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)',
          }}>
            {report}
          </pre>
        </div>
      </div>
    </div>
  );
}
