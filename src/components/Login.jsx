import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (username === 'admin' && password === 'cashflow') {
        onLogin()
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.')
        setLoading(false)
      }
    }, 400)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '15px', color: '#0f2340', outline: 'none',
    transition: 'border-color 0.2s', background: '#fff'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2340 0%, #1a3a5c 55%, #2563a8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ position: 'fixed', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(37,99,168,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

      <div style={{
        background: 'white', borderRadius: '20px', padding: '52px 48px',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.35)', position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #0f2340, #2563a8)',
            borderRadius: '16px', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
            boxShadow: '0 8px 24px rgba(37,99,168,0.35)'
          }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path d="M4 24 L8 17 L13 20 L17 11 L21 15 L25 7 L29 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="17" cy="11" r="2.5" fill="#93c5fd"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#0f2340', marginBottom: '6px', fontWeight: '700' }}>
            CashFlow IA
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', letterSpacing: '0.5px' }}>Prévision &amp; Analyse de Trésorerie</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Identifiant
            </label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Votre identifiant" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563a8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Mot de passe
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563a8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0f2340, #2563a8)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '600', letterSpacing: '0.3px',
            boxShadow: '0 4px 14px rgba(37,99,168,0.4)'
          }}>
            {loading ? 'Connexion en cours...' : 'Accéder au tableau de bord'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>
            Plateforme sécurisée — Usage réservé aux directions financières
          </p>
        </div>
      </div>
    </div>
  )
}
