import React from 'react'
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine, Area
} from 'recharts'
import { formatCurrency } from '../utils/calculations'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f2340', borderRadius: '10px', padding: '14px 18px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', minWidth: '200px'
    }}>
      <p style={{ color: '#93c5fd', fontWeight: '700', marginBottom: '8px', fontSize: '13px' }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '4px' }}>
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>{p.name}</span>
          <span style={{ color: p.color, fontWeight: '600', fontSize: '12px' }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TreasuryChart({ results }) {
  const data = results.map(r => ({
    name: r.mois.substring(0, 3),
    'Solde fin de mois': r.soldeFin,
    'Entrées': r.totalEntrees,
    'Sorties': r.totalSorties,
  }))

  const hasTension = results.some(r => r.enTension)

  return (
    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(15,35,64,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '24px 28px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: '#0f2340', marginBottom: '4px' }}>Evolution de la Trésorerie</h2>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Solde prévisionnel mensuel avec flux entrants et sortants</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {hasTension && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', padding: '6px 12px', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>Zone de tension</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', padding: '6px 12px', borderRadius: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>Zone saine</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 12px 16px' }}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data} margin={{ top: 8, right: 24, left: 12, bottom: 8 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563a8" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563a8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => Math.abs(v) >= 1000 ? `${(v/1000).toFixed(0)}k€` : `${v}€`}
              tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} />
            <ReferenceLine y={0} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: '0€', position: 'right', fill: '#dc2626', fontSize: 11 }} />
            <Bar dataKey="Entrées" fill="#bfdbfe" radius={[3,3,0,0]} opacity={0.75} />
            <Bar dataKey="Sorties" fill="#fecaca" radius={[3,3,0,0]} opacity={0.75} />
            <Area
              type="monotone" dataKey="Solde fin de mois"
              stroke="#2563a8" strokeWidth={2.5} fill="url(#areaGradient)"
              dot={(props) => {
                const { cx, cy, payload } = props
                const isTension = payload['Solde fin de mois'] < 0
                return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={5} fill={isTension ? '#dc2626' : '#2563a8'} stroke="white" strokeWidth={2} />
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
