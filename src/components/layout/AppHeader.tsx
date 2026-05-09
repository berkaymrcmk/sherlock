import { useState } from 'react';
import { Edit2, Download, RotateCcw, FileText, Hash } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import { ReportModal } from '../panels/ReportModal';

export function AppHeader() {
  const { investigation, updateInvestigationMeta, resetInvestigation, getGraphJSON } = useGraphStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingCase, setEditingCase] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [caseDraft, setCaseDraft] = useState('');
  const [showReport, setShowReport] = useState(false);

  const handleTitleClick = () => { setTitleDraft(investigation.title); setEditingTitle(true); };
  const handleTitleSave = () => {
    if (titleDraft.trim()) updateInvestigationMeta(titleDraft.trim(), investigation.caseNumber);
    setEditingTitle(false);
  };
  const handleCaseClick = () => { setCaseDraft(investigation.caseNumber ?? ''); setEditingCase(true); };
  const handleCaseSave = () => {
    updateInvestigationMeta(investigation.title, caseDraft.trim());
    setEditingCase(false);
  };

  const handleExport = () => {
    const blob = new Blob([getGraphJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sherlock-${investigation.id.slice(0, 8)}.json`;
    a.click();
  };

  const handleReset = () => {
    if (confirm('Tüm soruşturma verisi silinecek. Emin misiniz?')) resetInvestigation();
  };

  const suspects = investigation.nodes.filter(n => n.type === 'person' && (n.data as any).role === 'suspect').length;
  const confirmed = investigation.edges.filter(e => e.confidence === 'confirmed').length;

  return (
    <>
      <header className="app-header">
        {/* Sol: Dava bilgisi */}
        <div className="header-case-info">
          {editingTitle ? (
            <input
              className="form-input"
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') setEditingTitle(false); }}
              autoFocus style={{ width: 300, fontSize: 13, height: 26 }}
            />
          ) : (
            <div className="header-case-title" onClick={handleTitleClick} title="Başlığı düzenle">
              {investigation.title} <Edit2 size={10} style={{ opacity: 0.35, marginLeft: 3 }} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
            <Hash size={9} color="var(--text-muted)" />
            {editingCase ? (
              <input
                className="form-input"
                value={caseDraft}
                onChange={e => setCaseDraft(e.target.value)}
                onBlur={handleCaseSave}
                onKeyDown={e => { if (e.key === 'Enter') handleCaseSave(); if (e.key === 'Escape') setEditingCase(false); }}
                autoFocus style={{ width: 180, fontSize: 10, height: 20, padding: '2px 6px', fontFamily: 'var(--font-mono)' }}
                placeholder="Dava No..."
              />
            ) : (
              <span className="header-case-number" onClick={handleCaseClick} style={{ cursor: 'pointer' }} title="Dava numarasını düzenle">
                {investigation.caseNumber || 'Dava no girin →'} &nbsp;·&nbsp; Son güncelleme: {new Date(investigation.updatedAt).toLocaleString('tr-TR')}
              </span>
            )}
          </div>
        </div>

        {/* Orta: İstatistikler */}
        <div className="header-stats">
          <div className="header-stat">
            <span className="header-stat-value" style={{ color: 'var(--node-person)' }}>{suspects}</span>
            <span className="header-stat-label">Şüpheli</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-value">{investigation.nodes.length}</span>
            <span className="header-stat-label">Düğüm</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-value">{investigation.edges.length}</span>
            <span className="header-stat-label">İlişki</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-value" style={{ color: 'var(--status-confirmed)' }}>{confirmed}</span>
            <span className="header-stat-label">Doğrulandı</span>
          </div>
          <div className="header-stat">
            <span className="header-stat-value" style={{ color: 'var(--node-location)' }}>{investigation.mapPins.length}</span>
            <span className="header-stat-label">Pin</span>
          </div>
        </div>

        {/* Sağ: Eylemler */}
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => setShowReport(true)}>
            <FileText size={13} /> Rapor Oluştur
          </button>
          <button className="btn btn-ghost" onClick={handleExport}>
            <Download size={13} /> JSON
          </button>
          <button className="btn btn-danger btn-icon" onClick={handleReset} title="Soruşturmayı Sıfırla">
            <RotateCcw size={13} />
          </button>
        </div>
      </header>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </>
  );
}
