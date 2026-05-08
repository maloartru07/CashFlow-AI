export const MONTH_NAMES = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
]

export function computeTreasury(data) {
  let solde = parseFloat(data.soldeBancaire) || 0
  return data.months.map(m => {
    const encaissements = parseFloat(m.encaissements) || 0
    const decaissements = parseFloat(m.decaissements) || 0
    const echeancesFournisseurs = parseFloat(m.echeancesFournisseurs) || 0
    const echeancesClients = parseFloat(m.echeancesClients) || 0
    const chargesFixes = parseFloat(m.chargesFixes) || 0

    const totalEntrees = encaissements + echeancesClients
    const totalSorties = decaissements + echeancesFournisseurs + chargesFixes
    const fluxNet = totalEntrees - totalSorties
    const soldeDebut = solde
    const soldeFin = solde + fluxNet
    solde = soldeFin

    return {
      mois: m.mois,
      soldeDebut,
      encaissements,
      echeancesClients,
      totalEntrees,
      decaissements,
      echeancesFournisseurs,
      chargesFixes,
      totalSorties,
      fluxNet,
      soldeFin,
      enTension: soldeFin < 0,
      critique: soldeFin < -10000
    }
  })
}

export function computeKPIs(results, data) {
  const soldes = results.map(r => r.soldeFin)
  const soldeMin = Math.min(...soldes)
  const soldeMax = Math.max(...soldes)
  const moisEnTension = results.filter(r => r.enTension).length

  const totalClients = results.reduce((s, r) => s + r.echeancesClients, 0)
  const totalEntrees = results.reduce((s, r) => s + r.totalEntrees, 0)
  const dso = totalEntrees > 0 ? Math.round((totalClients / totalEntrees) * 30) : 0

  const moyenneSorties = results.reduce((s, r) => s + r.totalSorties, 0) / results.length
  const couvertureJours = moyenneSorties > 0
    ? Math.round(((parseFloat(data.soldeBancaire) || 0) / moyenneSorties) * 30)
    : 0

  return { soldeMin, soldeMax, moisEnTension, dso, couvertureJours }
}

export function computeHealthScore(results, kpis) {
  let score = 100
  score -= kpis.moisEnTension * 15
  if (kpis.soldeMin < -50000) score -= 20
  else if (kpis.soldeMin < -10000) score -= 10
  else if (kpis.soldeMin < 0) score -= 5
  if (kpis.couvertureJours < 15) score -= 15
  else if (kpis.couvertureJours < 30) score -= 8
  if (kpis.couvertureJours > 90) score += 5
  if (kpis.soldeMin > 50000) score += 5
  return Math.max(0, Math.min(100, score))
}

export function generateRecommendations(results, kpis) {
  const recs = []

  if (kpis.moisEnTension > 0) {
    const tensionMonths = results.filter(r => r.enTension).map(r => r.mois).join(', ')
    recs.push({
      category: 'Financement Court Terme',
      severity: 'high',
      title: 'Activer une ligne de crédit confirmée',
      detail: `${kpis.moisEnTension} mois présentent un solde négatif (${tensionMonths}). Négociez une ligne de crédit revolving avec votre banque principale pour couvrir ces tensions de trésorerie.`
    })
    recs.push({
      category: 'Négociation Fournisseurs',
      severity: 'high',
      title: 'Décaler les paiements fournisseurs',
      detail: `Sur les mois en tension, négociez un allongement des délais fournisseurs de 30 à 60 jours. Une réduction de 20% des décaissements fournisseurs peut suffire à rétablir l'équilibre.`
    })
  }

  if (kpis.dso > 45) {
    recs.push({
      category: 'Optimisation BFR',
      severity: 'high',
      title: 'Réduire le délai moyen de paiement clients',
      detail: `Votre DSO estimé est de ${kpis.dso} jours. Mettez en place des relances automatiques dès J+30, proposez un escompte de 1-2% pour paiement comptant, et systématisez les prélèvements automatiques.`
    })
  } else if (kpis.dso > 30) {
    recs.push({
      category: 'Optimisation BFR',
      severity: 'medium',
      title: 'Améliorer le recouvrement clients',
      detail: `Votre DSO de ${kpis.dso} jours est perfectible. Automatisez les relances et proposez des facilités de paiement par prélèvement pour accélérer les encaissements.`
    })
  }

  const moisExcedentaires = results.filter(r => r.soldeFin > 100000)
  if (moisExcedentaires.length >= 2) {
    recs.push({
      category: 'Placement des Excédents',
      severity: 'low',
      title: 'Placer les excédents de trésorerie',
      detail: `Plusieurs mois affichent des excédents significatifs. Envisagez des OPCVM monétaires ou des dépôts à terme pour optimiser le rendement de votre trésorerie oisive et lutter contre l'érosion monétaire.`
    })
  }

  if (kpis.couvertureJours < 30) {
    recs.push({
      category: 'Réserve de Sécurité',
      severity: 'medium',
      title: 'Constituer une réserve de trésorerie',
      detail: `Votre couverture actuelle de ${kpis.couvertureJours} jours est insuffisante. Visez une réserve équivalant à 45-60 jours de charges opérationnelles pour absorber les imprévus sans recours à l'endettement.`
    })
  }

  const fluxNets = results.map(r => r.fluxNet)
  const volatilite = Math.max(...fluxNets) - Math.min(...fluxNets)
  if (volatilite > 50000) {
    recs.push({
      category: 'Gestion des Flux',
      severity: 'medium',
      title: 'Lisser les flux de trésorerie',
      detail: `Forte volatilité des flux détectée. Étudiez le rééchelonnement de certains paiements importants pour réduire les pics et creux et maintenir un solde plus stable tout au long de l'exercice.`
    })
  }

  if (recs.length === 0) {
    recs.push({
      category: 'Situation Saine',
      severity: 'low',
      title: 'Trésorerie en bonne santé',
      detail: 'Vos flux prévisionnels sont bien équilibrés sur l'ensemble de l'exercice. Continuez à monitorer les indicateurs mensuellement et anticipez les besoins saisonniers à venir.'
    })
  }

  return recs
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value)
}
