export const totalJenis = (items, jenis) => items
  .filter((item) => item.jenis === jenis)
  .reduce((total, item) => total + Number(item.jumlah), 0)

// Capital (modal) adds to the balance but is not profit.
export const saldo = (items) => totalJenis(items, 'Modal') + totalJenis(items, 'Pemasukan') - totalJenis(items, 'Pengeluaran')

// Colours and form text per record type.
export const JENIS = {
  Pemasukan: { tombol: '↑ Pemasukan', badge: 'bg-green-100 text-green-700', aktif: 'bg-green-600 text-white', simpan: 'bg-green-600 hover:bg-green-700', input: 'border-green-300 focus:border-green-500 focus:ring-green-500', grafik: '#16a34a', labelSumber: 'Sumber Pemasukan', contoh: 'Contoh: Penjualan di bazar, Pesanan langsung...' },
  Modal: { tombol: '＋ Modal', badge: 'bg-indigo-100 text-indigo-700', aktif: 'bg-indigo-600 text-white', simpan: 'bg-indigo-600 hover:bg-indigo-700', input: 'border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500', grafik: '#4f46e5', labelSumber: 'Sumber Modal', contoh: 'Contoh: Tabungan pribadi, Pinjaman keluarga...' },
  Pengeluaran: { tombol: '↓ Pengeluaran', badge: 'bg-red-100 text-red-700', aktif: 'bg-red-500 text-white', simpan: 'bg-red-500 hover:bg-red-600', input: 'border-red-300 focus:border-red-400 focus:ring-red-400', grafik: '#ef4444', labelSumber: 'Keperluan / Tujuan Pengeluaran', contoh: 'Contoh: Pembelian bahan baku, Biaya operasional...' },
}

const tanggalLokal = (iso) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Row label in the summary: "Oktober 2026", "2–8 Nov", or "Sen, 2 Nov".
export function labelPeriode(periode, { mulai, sampai }) {
  const awal = tanggalLokal(mulai)
  if (periode === 'bulanan') return awal.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  if (periode === 'harian') return awal.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
  const bulan = awal.toLocaleDateString('id-ID', { month: 'short' })
  return mulai === sampai ? `${awal.getDate()} ${bulan}` : `${awal.getDate()}–${tanggalLokal(sampai).getDate()} ${bulan}`
}

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
    days[key] ??= { key, Modal: 0, Pemasukan: 0, Pengeluaran: 0 }
    days[key][item.jenis] = (days[key][item.jenis] ?? 0) + Number(item.jumlah)
  }
  const rows = Object.values(days).sort((a, b) => a.key.localeCompare(b.key))
  const multiYear = new Set(rows.map((row) => row.key.slice(0, 4))).size > 1
  return rows.map((row) => ({ ...row, tanggal: formatHari(row.key, multiYear) }))
}

// Short axis labels: 15000 -> "15 rb", 1000000 -> "1 jt".
export const rupiahSingkat = (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
