import { Handle, Position } from 'reactflow';
import type { NoteNodeData } from '../../../types';

export function NoteNode({ data, selected }: { data: NoteNodeData; selected: boolean }) {
  const bgColor = data.color || '#fef08a'; // default post-it yellow

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''}`}
      style={{
        width: 200,
        backgroundColor: bgColor,
        borderColor: selected ? '#333' : 'rgba(0,0,0,0.1)',
        boxShadow: selected ? '0 0 0 2px rgba(0,0,0,0.1), 4px 4px 10px rgba(0,0,0,0.1)' : '2px 2px 5px rgba(0,0,0,0.05)',
        borderRadius: 2, // sharp corners like a post-it
        padding: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Handle type="target" position={Position.Top} className="node-handle" />
      <Handle type="source" position={Position.Bottom} className="node-handle" />

      {/* Folded corner effect (optional styling) */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        borderWidth: '0 16px 16px 0', borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.05) var(--bg-base) rgba(0,0,0,0) rgba(0,0,0,0)',
        display: 'block', width: 0
      }}></div>

      <div style={{ padding: '12px 16px' }}>
        {data.label && (
          <div style={{ 
            fontWeight: 600, 
            fontSize: 14, 
            marginBottom: 8, 
            color: '#1f2937',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingBottom: 4
          }}>
            {data.label}
          </div>
        )}
        <div style={{ 
          fontSize: 13, 
          color: '#374151', 
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-ui)' // maybe cursive later
        }}>
          {data.text || 'Boş not...'}
        </div>
      </div>
    </div>
  );
}
