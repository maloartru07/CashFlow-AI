import React from 'react'

export default function HealthScore({ score }) {
  const color = score >= 60 ? '#16a34a' : score >= 30 ? '#ea580c' : '#dc2626'
  const bgColor = score >= 60 ? '#f0fdf4' : score >= 30 ? '#fff7ed' : '#fef2f2'
  const borderColor = score >= 60 ? '#bbf7d0' : score >= 30 ? '#fed7aa' : '#fecaca'
  const label = score >= 60 ? 'Santé Solide' : score >= 30 ? 'Attention Requise' : 'Situation Critique'

  const radius = 72
  const cx = 96
  const cy = 96
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const arcDegrees = 240
  const arcLength = (arcDegrees / 360) * circumference
  const scoreArc = (score / 100) * arcLength

  return (
    <div style={{
      background: bgColor, borderRadius: '16px', border: `1.5px solid ${borderColor}`,
      boxShadow: '0 4px 20px rgba(15,35,64,0.08)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '28px 20px'
    }}>
      <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
        Score de Santé
      </p>

      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg width="180" height="180" viewBox="0 0 192 192">
          <circle cx={cx} cy={cy} r={radius} fill="none"
            stroke={borderColor} strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={arcLength * 0.333}
            strokeLinecap="round"
            transform={`rotate(150 ${cx} ${cy})`}
          />
          <circle cx={cx} cy={cy} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${scoreArc} ${circumference - scoreArc}`}
            strokeDashoffset={arcLength * 0.333}
            strokeLinecap="round"
            transform={`rotate(150 ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '42px', fontWeight: '700', color, lineHeight: 1, fontFamily: 'Playfair Display, serif' }}>{score}</span>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>/100</span>
        </div>
      </div>

      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '15px', fontWeight: '700', color, marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '12px', color: '#64748b' }}>
          {score >= 60 ? 'Flux bien maîtrisés' : score >= 30 ? 'Surveiller les tensions' : 'Actions urgentes requises'}
        </p>
      </div>
    </div>
  )
}
