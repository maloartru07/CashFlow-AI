import React, { useState } from 'react'
import { MONTH_NAMES } from '../utils/calculations'

const FIELD_LABELS = [
  { key: 'encaissements', label: 'Encaissements prévus', placeholder: 'ex: 85000' },
  { key: 'echeancesClients', label: 'Échéances clients', placeholder: 'ex: 42000' },
  { key: 'decaissements', label: 'Décaissements prévus', placeholder: 'ex: 60000' },
  { key: 'echeancesFournisseurs', label: 'Échéances fournisseurs', placeholder: 'ex: 25000' },
  { key: 'chargesFixes', label: 'Charges fixes', placeholder: 'ex: 18000' },
]

export default function InputForm({ initialData, onAnalyze }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(initialData)
  const totalSteps = 1 + data.months.length

  const updateGeneral = (field, value) => setData(d => ({ ...d, [field]: value }))
  const updateMonth = (idx, field, value) => {
    setData(d => {
      const months = [...d.months]
      months[idx] = { ...months[idx], [field]: value }
      return { ...d, months }
    })
  }

  const canProceed = () => {
    if (step === 0) return data.companyName.trim() !== '' && data.soldeBancaire !== ''
    return true
  }

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(s => s + 1)
    else onAnalyze(data)
  }

  const monthIdx = step - 1
  const progress = step === 0 ? 0 : Math.round((step / (totalSteps - 1)) * 100)

  const cardStyle = {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(15,35,64,0.08)', overflow: 'hidden'
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', color: '#0f2340', outline: 'none',
    transition: 'border-color 0.2s'
  }

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: '700',
    color: '#64748b', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.8px'
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '30px', color: '#0f2340', marginBottom: '10px' }}>Configurez votre analyse</h1>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Saisissez les données de votre entreprise pour obtenir une prévision complète de trésorerie</p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f2340' }}>
            {step === 0 ? 'Informations générales' : `Mois ${step} / ${data.months.length} — ${data.months[monthIdx]?.mois}`}
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>{progress}% complété</span>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #0f2340, #2563a8)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ background: 'linear-gradient(90deg, #0f2340, #1a3a5c)', padding: '20px 32px' }}>
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '20px', marginBottom: '4px' }}>
            {step === 0 ? 'Établissement & Période' : data.months[monthIdx]?.mois}
          </h2>
          <p style={{ color: '#93c5fd', fontSize: '13px' }}>
            {step === 0 ? 'Renseignez les informations de base de votre analyse' : 'Saisissez les flux de trésorerie prévisionnels pour ce mois'}
          </p>
        </div>

        <div style={{ padding: '32px' }}>
          {step === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nom de l’entreprise</label>
                <input style={inputStyle} type="text" placeholder="ex: Société Martin SAS"
                  value={data.companyName}
                  onChange={e => updateGeneral('companyName', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#2563a8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={labelStyle}>Exercice fiscal</label>
                <input style={inputStyle} type="number" placeholder={new Date().getFullYear()}
                  value={data.fiscalYear}
                  onChange={e => updateGeneral('fiscalYear', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#2563a8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={labelStyle}>Solde bancaire actuel (€)</label>
                <input style={inputStyle} type="number" placeholder="ex: 150000"
                  value={data.soldeBancaire}
                  onChange={e => updateGeneral('soldeBancaire', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#2563a8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nombre de mois à analyser</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[3, 6, 9, 12].map(n => (
                    <button key={n} type="button"
                      onClick={() => setData(d => ({
                        ...d,
                        months: MONTH_NAMES.slice(0, n).map((m, i) =>
                          d.months[i] || { mois: m, encaissements: '', decaissements: '', echeancesFournisseurs: '', echeancesClients: '', chargesFixes: '' }
                        )
                      }))}
                      style={{
                        padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                        border: data.months.length === n ? 'none' : '1.5px solid #e2e8f0',
                        background: data.months.length === n ? 'linear-gradient(135deg, #0f2340, #2563a8)' : 'white',
                        color: data.months.length === n ? 'white' : '#334155'
                      }}
                    >{n} mois</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {FIELD_LABELS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label} (€)</label>
                  <input style={inputStyle} type="number" placeholder={placeholder}
                    value={data.months[monthIdx]?.[key] || ''}
                    onChange={e => updateMonth(monthIdx, key, e.target.value)}
                    onFocus={e => e.target.style.borderColor = '#2563a8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              ))}
              {monthIdx === 0 && (
                <div style={{ gridColumn: '1 / -1', marginTop: '4px', padding: '14px 16px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                  <p style={{ fontSize: '13px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>Astuce : appliquer à tous les mois</p>
                  <p style={{ fontSize: '12px', color: '#0284c7', marginBottom: '8px' }}>Renseignez les montants ci-dessus puis cliquez pour les dupliquer sur tous les mois.</p>
                  <button type="button" onClick={() => {
                    const template = data.months[0]
                    setData(d => ({ ...d, months: d.months.map((m, i) => i === 0 ? m : { ...template, mois: m.mois }) }))
                  }} style={{ padding: '7px 16px', background: '#0369a1', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                    Appliquer à tous les mois
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: '20px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            style={{
              padding: '10px 24px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
              fontSize: '14px', fontWeight: '500',
              background: step === 0 ? '#f8fafc' : 'white',
              color: step === 0 ? '#cbd5e1' : '#334155'
            }}>
            ← Précédent
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: Math.min(totalSteps, 13) }).map((_, i) => (
              <div key={i} style={{
                width: i === step ? '20px' : '8px', height: '8px', borderRadius: '99px',
                transition: 'all 0.3s', background: i <= step ? '#2563a8' : '#e2e8f0'
              }} />
            ))}
          </div>

          <button type="button" onClick={handleNext} disabled={!canProceed()}
            style={{
              padding: '10px 28px',
              background: canProceed() ? 'linear-gradient(135deg, #0f2340, #2563a8)' : '#cbd5e1',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: '600',
              boxShadow: canProceed() ? '0 4px 12px rgba(37,99,168,0.3)' : 'none'
            }}>
            {step === totalSteps - 1 ? 'Lancer l’analyse →' : 'Suivant →'}
          </button>
        </div>
      </div>

      {step > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {data.months.map((m, i) => (
            <button key={i} type="button" onClick={() => setStep(i + 1)}
              style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                border: '1px solid', borderColor: i + 1 === step ? '#2563a8' : '#e2e8f0',
                background: i + 1 === step ? '#eff6ff' : 'white',
                color: i + 1 === step ? '#1d4ed8' : '#64748b'
              }}>
              {m.mois.substring(0, 3)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
