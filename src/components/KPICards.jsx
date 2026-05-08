import React from 'react'
import { formatCurrency } from '../utils/calculations'

const KPI = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: 'white', borderRadius: '12px',
    padding: '18px 20px', borderLeft: `4px solid ${color}`,
    boxShadow: '0 2px 12px rgba(15,35,64,0.06)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</p>
        <p style={{ fontSize: '22px', fontWeight: '700', color: '#0f2340', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{sub}</p>}
      </div>
      <span style={{ fontSize: '24px', opacity: 0.7 }}>{icon}</span>
    </div>
  </div>
)

export default function KPICards({ kpis }) {
  const { soldeMin, soldeMax, moisEnTension, dso, couvertureJours } = kpis
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', alignContent: 'start' }}>
      <KPI label="Solde minimum prévu" value={formatCurrency(soldeMin)}
        sub={soldeMin < 0 ? '⚠️ Négatif' : 'Positif'}
        color={soldeMin < 0 ? '#dc2626' : '#16a34a'} icon="📉" />
      <KPI label="Solde maximum prévu" value={formatCurrency(soldeMax)}
        sub="Pic de trésorerie" color="#16a34a" icon="📈" />
      <KPI label="Mois en tension" value={moisEnTension}
        sub={moisEnTension === 0 ? 'Aucune tension' : `sur ${kpis.moisEnTension} mois`}
        color={moisEnTension > 0 ? '#dc2626' : '#16a34a'} icon="⚡" />
      <KPI label="DSO clients estimé" value={`${dso} jours`}
        sub={dso > 45 ? '⚠️ À optimiser' : 'Acceptable'}
        color={dso > 45 ? '#ea580c' : '#2563a8'} icon="📅" />
      <KPI label="Couverture trésorerie" value={`${couvertureJours}j`}
        sub="Jours de charges couverts"
        color={couvertureJours < 30 ? '#ea580c' : '#2563a8'} icon="🛡️" />
      <KPI label="Solde initial" value={formatCurrency(0)}
        sub="Voir tableau complet" color="#2563a8" icon="🏦" />
    </div>
  )
}
