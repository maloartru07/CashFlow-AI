import React, { useState } from 'react'
import InputForm from './InputForm'
import TreasuryChart from './TreasuryChart'
import HealthScore from './HealthScore'
import KPICards from './KPICards'
import TensionDetection from './TensionDetection'
import Recommendations from './Recommendations'
import { computeTreasury, computeKPIs, computeHealthScore, generateRecommendations, MONTH_NAMES } from '../utils/calculations'
import { generatePDF } from '../utils/pdfGenerator'

const makeInitialMonths = () =>
  MONTH_NAMES.map(m => ({
    mois: m, encaissements: '', decaissements: '',
    echeancesFournisseurs: '', echeancesClients: '', chargesFixes: ''
  }))

export default function Dashboard({ onLogout }) {
  const [view, setView] = useState('form')
  const [formData, setFormData] = useState({
    companyName: '', fiscalYear: new Date().getFullYear(),
    soldeBancaire: '', months: makeInitialMonths()
  })
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = (data) => {
    const results = computeTreasury(data)
    const kpis = computeKPIs(results, data)
    const healthScore = computeHealthScore(results, kpis)
    const recommendations = generateRecommendations(results, kpis)
    setFormData(data)
    setAnalysis({ results, kpis, healthScore, recommendations })
    setView('results')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{
        background: 'linear-gradient(90deg, #0f2340 0%, #1a3a5c 100%)',
        padding: '0 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px',
        boxShadow: '0 2px 16px rgba(15,35,64,0.4)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #2563a8, #3b82f6)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M4 24 L8 17 L13 20 L17 11 L21 15 L25 7 L29 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '19px', fontWeight: '700', lineHeight: 1.1 }}>CashFlow IA</div>
            <div style={{ color: '#93c5fd', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Prévision de Trésorerie</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {view === 'results' && analysis && (
            <>
              <button onClick={() => generatePDF(formData, analysis.results, analysis.kpis, analysis.healthScore, analysis.recommendations)}
                style={{
                  background: '#2563a8', color: 'white', border: 'none',
                  borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Télécharger PDF
              </button>
              <button onClick={() => setView('form')} style={{
                background: 'rgba(255,255,255,0.08)', color: 'white',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                padding: '8px 16px', fontSize: '13px', fontWeight: '500'
              }}>
                Modifier
              </button>
            </>
          )}
          <button onClick={onLogout} style={{
            background: 'transparent', color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '8px 14px', fontSize: '12px'
          }}>
            Déconnexion
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '36px 32px' }}>
        {view === 'form'
          ? <InputForm initialData={formData} onAnalyze={handleAnalyze} />
          : analysis && <ResultsView analysis={analysis} formData={formData} />
        }
      </main>
    </div>
  )
}

function ResultsView({ analysis, formData }) {
  const { results, kpis, healthScore, recommendations } = analysis
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', color: '#0f2340', marginBottom: '4px' }}>
          Analyse de Trésorerie — {formData.companyName || 'Votre Entreprise'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Exercice {formData.fiscalYear} · Prévision sur {results.length} mois
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', marginBottom: '20px' }}>
        <HealthScore score={healthScore} />
        <KPICards kpis={kpis} />
      </div>

      <TreasuryChart results={results} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <TensionDetection results={results} />
        <Recommendations recommendations={recommendations} />
      </div>
    </div>
  )
}
