import React from 'react'
import { formatCurrency } from '../utils/calculations'

function getTensionRecommendation(result) {
  if (result.critique) {
    return 'Activation immédiate d’une ligne de crédit recommandée. Déficit critique.'
  }
  if (result.totalSorties > result.totalEntrees * 1.3) {
    return 'Décaler les paiements fournisseurs non urgents. Relancer les impayés clients.'
  }
  return 'Négocier un délai de paiement fournisseur ou avancer des encaissements clients.'
}

export default function TensionDetection({ results }) {
  const tensionMonths = results.filter(r => r.enTension)
  const nearTension = results.filter(r => !r.enTension && r.soldeFin < 20000 && r.soldeFin >= 0)

  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(15,35,64,0.08)', overflow: 'hidden'
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '17px', color: '#0f2340', marginBottom: '2px' }}>Détection des Tensions</h2>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Mois à risque et actions recommandées</p>
      </div>

      <div style={{ padding: '20px 24px', maxHeight: '420px', overflowY: 'auto' }}>
        {tensionMonths.length === 0 && nearTension.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '32px',
            background: '#f0fdf4', borderRadius: '12px'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
            <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>Aucune tension détectée</p>
            <p style={{ color: '#15803d', fontSize: '13px' }}>Votre trésorerie reste positive sur tous les mois analysés.</p>
          </div>
        ) : (
          <>
            {tensionMonths.map(r => (
              <div key={r.mois} style={{
                marginBottom: '12px', padding: '14px 16px',
                background: r.critique ? '#fef2f2' : '#fff7ed',
                borderRadius: '10px',
                borderLeft: `4px solid ${r.critique ? '#dc2626' : '#ea580c'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f2340' }}>{r.mois}</span>
                  <span style={{
                    fontSize: '13px', fontWeight: '700',
                    color: r.critique ? '#dc2626' : '#ea580c'
                  }}>
                    {formatCurrency(r.soldeFin)}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                  Flux net : {formatCurrency(r.fluxNet)} · Entrées : {formatCurrency(r.totalEntrees)} · Sorties : {formatCurrency(r.totalSorties)}
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ fontSize: '13px', color: r.critique ? '#dc2626' : '#ea580c' }}>&#9654;</span>
                  <p style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>{getTensionRecommendation(r)}</p>
                </div>
              </div>
            ))}

            {nearTension.map(r => (
              <div key={r.mois} style={{
                marginBottom: '12px', padding: '14px 16px',
                background: '#fffbeb', borderRadius: '10px',
                borderLeft: '4px solid #d97706'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f2340' }}>{r.mois} <span style={{ fontWeight: '400', fontSize: '12px', color: '#d97706' }}>(vigilance)</span></span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#d97706' }}>{formatCurrency(r.soldeFin)}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Solde faible — anticiper les décaissements du mois suivant.</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
