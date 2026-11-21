export const totalJenis = (items, jenis) => items
  .filter((item) => item.jenis === jenis)
  .reduce((total, item) => total + Number(item.jumlah), 0)

export const saldo = (items) => totalJenis(items, 'Pemasukan') - totalJenis(items, 'Pengeluaran')

const formatHari = (key, withYear) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', ...(withYear && { year: '2-digit' }) })
}

// One bar group per calendar day (YYYY-MM-DD), so the same date in different years is not merged.
// The year only shows in the label when the data spans more than one year.
export function grafikPerTanggal(items) {
  const days = {}
  for (const item of items) {
    const key = String(item.tanggal ?? '').slice(0, 10)
    if (!key) continue
    days[key] ??= { key, Pemasukan: 0, Pengeluaran: 0 }
    days[key][item.jenis] = (days[key][item.jenis] ?? 0) + Number(item.jumlah)
  }
  const rows = Object.values(days).sort((a, b) => a.key.localeCompare(b.key))
  const multiYear = new Set(rows.map((row) => row.key.slice(0, 4))).size > 1
  return rows.map((row) => ({ ...row, tanggal: formatHari(row.key, multiYear) }))
}

// Short axis labels: 15000 -> "15 rb", 1000000 -> "1 jt".
export const rupiahSingkat = (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
