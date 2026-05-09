import { Bot, Cpu } from 'lucide-react';

export function AIAssistant() {
  return (
    <div className="chat-panel">
      <div className="chat-passive-banner">
        <Bot size={40} />
        <div className="chat-passive-title">Dijital Analist — Pasif Mod</div>
        <div className="chat-passive-desc">
          Yapay Zeka Asistanı şu anda devre dışıdır.<br />
          Bu modül, Canvas'taki düğümler ve ilişkileri bağlam olarak alarak çelişki analizi yapabilir,
          eksik bağlantıları tespit edebilir ve resmi polis raporu taslağı oluşturabilir.<br /><br />
          <strong style={{ color: 'var(--text-primary)' }}>Etkinleştirmek için:</strong> Sistem yöneticisine danışın.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          <Cpu size={14} /> Gemini Pro · Graph-Context RAG
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div className="chat-input-area" style={{ opacity: 0.4, pointerEvents: 'none' }}>
        <textarea className="chat-input" placeholder="Analist ile yazışmak için modül etkinleştirilmeli..." rows={2} disabled />
        <button className="btn btn-primary" disabled style={{ alignSelf: 'flex-end' }}>Gönder</button>
      </div>
    </div>
  );
}
