import React from 'react'

const SEVERITY_CONFIG = {
  high:   { label: 'Priorité haute',   bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#dc2626' },
  medium: { label: 'Priorité moyenne', bg: '#fff7ed', border: '#fed7aa', dot: '#ea580c', text: '#ea580c' },
  low:    { label: 'Information',       bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', text: '#16a34a' },
}

export default function Recommendations({ recommendations }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(15,35,64,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '17px', color: '#0f2340', marginBottom: '2px' }}>Recommandations Stratégiques</h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Actions actionables générées depuis vos données</p>
      </div>

      <div style={{ padding: '20px 24px', maxHeight: '420px', overflowY: 'auto' }}>
        {recommendations.map((rec, i) => {
          const cfg = SEVERITY_CONFIG[rec.severity] || SEVERITY_CONFIG.low
          return (
            <div key={i} style={{
              marginBottom: '12px', padding: '16px',
              background: cfg.bg, borderRadius: '10px', border: `1px solid ${cfg.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot, marginTop: '5px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px', flexWrap: 'wrap' }}>
                    <p style={{ fontWeight: '700', fontSize: '13px', color: '#0f2340' }}>{rec.title}</p>
                    <span style={{
                      fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                      background: 'white', borderRadius: '99px',
                      color: cfg.text, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap', flexShrink: 0
                    }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', fontStyle: 'italic' }}>{rec.category}</p>
                  <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.55' }}>{rec.detail}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
