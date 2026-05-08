import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency } from './calculations'

export function generatePDF(data, results, kpis, healthScore, recommendations) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const navy = [15, 35, 64]
  const blue = [37, 99, 168]
  const white = [255, 255, 255]
  const lightGray = [248, 250, 252]
  const darkGray = [51, 65, 85]
  const pageWidth = 210
  const pageHeight = 297
  const margin = 20

  const addPageHeader = () => {
    doc.setFillColor(...navy)
    doc.rect(0, 0, pageWidth, 15, 'F')
    doc.setTextColor(...white)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.text('CashFlow IA — Rapport de Trésorerie (confidentiel)', margin, 10)
    doc.setFont('helvetica', 'normal')
    doc.text(data.companyName || '', pageWidth - margin, 10, { align: 'right' })
  }

  // Cover header
  doc.setFillColor(...navy)
  doc.rect(0, 0, pageWidth, 50, 'F')
  doc.setFillColor(...blue)
  doc.rect(0, 50, pageWidth, 4, 'F')

  doc.setTextColor(...white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.text('CashFlow IA', margin, 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Rapport de Prévision de Trésorerie', margin, 32)
  doc.setFontSize(9)
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(`Généré le ${dateStr}`, margin, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(data.companyName || 'Entreprise', pageWidth - margin, 28, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Exercice ${data.fiscalYear || new Date().getFullYear()}`, pageWidth - margin, 38, { align: 'right' })

  let y = 62

  // Score block
  doc.setFillColor(...lightGray)
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 30, 3, 3, 'F')
  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Score de Santé Financière', margin + 8, y + 9)
  const scoreColor = healthScore >= 60 ? [22, 163, 74] : healthScore >= 30 ? [234, 88, 12] : [220, 38, 38]
  doc.setTextColor(...scoreColor)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text(`${healthScore}/100`, margin + 8, y + 23)

  doc.setTextColor(...darkGray)
  doc.setFontSize(8)
  const kpiItems = [
    `Solde min: ${formatCurrency(kpis.soldeMin)}`,
    `Solde max: ${formatCurrency(kpis.soldeMax)}`,
    `Mois en tension: ${kpis.moisEnTension}`,
    `DSO estimé: ${kpis.dso}j`,
    `Couverture: ${kpis.couvertureJours}j`
  ]
  let kx = margin + 58
  kpiItems.forEach(k => { doc.text(k, kx, y + 18); kx += 31 })

  y += 40

  // Table
  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Tableau de Flux de Trésorerie', margin, y)
  y += 5

  doc.autoTable({
    head: [['Mois', 'Solde début', 'Entrées totales', 'Sorties totales', 'Flux net', 'Solde fin']],
    body: results.map(r => [
      r.mois,
      formatCurrency(r.soldeDebut),
      formatCurrency(r.totalEntrees),
      formatCurrency(r.totalSorties),
      formatCurrency(r.fluxNet),
      formatCurrency(r.soldeFin)
    ]),
    startY: y,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: navy, textColor: white, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell: (d) => {
      if (d.section === 'body' && results[d.row.index]?.enTension) {
        d.cell.styles.textColor = [220, 38, 38]
        d.cell.styles.fontStyle = 'bold'
      }
    }
  })

  y = doc.lastAutoTable.finalY + 14

  if (y > pageHeight - 70) {
    doc.addPage()
    addPageHeader()
    y = 24
  }

  doc.setTextColor(...navy)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Recommandations Stratégiques', margin, y)
  y += 8

  recommendations.forEach((rec, i) => {
    if (y > pageHeight - 35) {
      doc.addPage()
      addPageHeader()
      y = 24
    }
    const rc = rec.severity === 'high' ? [220, 38, 38] : rec.severity === 'medium' ? [234, 88, 12] : [22, 163, 74]
    doc.setFillColor(...rc)
    doc.rect(margin, y, 3, 18, 'F')
    doc.setTextColor(...navy)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`${i + 1}. ${rec.title}`, margin + 7, y + 6)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(rec.category, margin + 7, y + 11)
    doc.setTextColor(...darkGray)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const lines = doc.splitTextToSize(rec.detail, pageWidth - 2 * margin - 10)
    doc.text(lines, margin + 7, y + 17)
    y += 16 + lines.length * 4 + 4
  })

  // Footer on all pages
  const total = doc.internal.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFillColor(...navy)
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F')
    doc.setTextColor(...white)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text('Document confidentiel — CashFlow IA', margin, pageHeight - 4)
    doc.text(`Page ${i} / ${total}`, pageWidth - margin, pageHeight - 4, { align: 'right' })
  }

  const fileName = `CashFlow_IA_${(data.companyName || 'Rapport').replace(/\s+/g, '_')}_${data.fiscalYear || new Date().getFullYear()}.pdf`
  doc.save(fileName)
}
