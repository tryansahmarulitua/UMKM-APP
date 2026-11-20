import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DashboardLayout from '../../layouts/DashboardLayout'
import { laporanService } from '../../services/laporanService'

const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
const formatTanggal = (value) => value ? String(value).slice(0, 10) : '-'
const chartDate = (value) => value ? String(value).slice(5, 10) : '-'

export default function LaporanList() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try { setItems(await laporanService.getAll()) } catch (err) { setError(err.response?.data?.message || 'Gagal memuat laporan.') } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus catatan keuangan ini?')) return
    try { await laporanService.destroy(id); setItems((prev) => prev.filter((item) => item.idLK !== id)) } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus laporan.') }
  }

  const total = items.reduce((saldo, item) => (
    saldo + (item.jenis === 'Pemasukan' ? Number(item.jumlah) : -Number(item.jumlah))
  ), 0)

  const totalPemasukan = items.filter(i => i.jenis === 'Pemasukan').reduce((s, i) => s + Number(i.jumlah), 0)
  const totalPengeluaran = items.filter(i => i.jenis === 'Pengeluaran').reduce((s, i) => s + Number(i.jumlah), 0)

  // group by tanggal untuk bar chart
  const chartData = Object.values(
    items.reduce((acc, item) => {
      const tgl = chartDate(item.tanggal)
      if (!acc[tgl]) acc[tgl] = { tanggal: tgl, Pemasukan: 0, Pengeluaran: 0 }
      acc[tgl][item.jenis] = (acc[tgl][item.jenis] || 0) + Number(item.jumlah)
      return acc
    }, {})
  ).sort((a, b) => a.tanggal.localeCompare(b.tanggal))

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1><p className="mt-1 text-sm text-gray-500">Catatan sumber modal dan keuangan usaha.</p></div>
          <button onClick={() => navigate('/laporan-keuangan/tambah')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah Catatan</button>
        </div>
        <div className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm"><p className="text-sm text-indigo-100">Total Saldo</p><p className="mt-1 text-2xl font-bold">{rupiah(total)}</p></div>
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {!loading && items.length > 0 && <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-lg font-semibold text-gray-900">Analisis Keuangan</h2><p className="mt-1 text-sm text-gray-500">Perbandingan pemasukan dan pengeluaran berdasarkan tanggal.</p></div>
            <div className="flex gap-4 text-sm"><span className="text-green-600">Masuk: <strong>{rupiah(totalPemasukan)}</strong></span><span className="text-red-600">Keluar: <strong>{rupiah(totalPengeluaran)}</strong></span></div>
          </div>
          <div className="mt-6 h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tanggal" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} width={48} />
                <Tooltip formatter={(value) => rupiah(value)} />
                <Legend />
                <Bar dataKey="Pemasukan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? <div className="p-10 text-center text-sm text-gray-400">Memuat data...</div> : items.length === 0 ? <div className="p-10 text-center text-sm text-gray-400">Belum ada catatan keuangan.</div> : (
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3.5 sm:px-6">Jenis</th><th className="px-4 py-3.5 sm:px-6">Sumber</th><th className="px-4 py-3.5 sm:px-6">Jumlah</th><th className="hidden px-4 py-3.5 sm:table-cell sm:px-6">Tanggal</th><th className="hidden px-4 py-3.5 md:table-cell md:px-6">Keterangan</th><th className="px-4 py-3.5 text-right sm:px-6">Aksi</th></tr></thead><tbody className="divide-y divide-gray-100">{items.map((item) => <tr key={item.idLK} className="transition hover:bg-indigo-50/40"><td className="whitespace-nowrap px-4 py-4 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.jenis === 'Pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.jenis}</span></td><td className="px-4 py-4 font-medium text-gray-900 sm:px-6">{item.namaSumber}</td><td className="whitespace-nowrap px-4 py-4 text-gray-700 sm:px-6">{rupiah(item.jumlah)}</td><td className="hidden whitespace-nowrap px-4 py-4 text-gray-600 sm:table-cell sm:px-6">{formatTanggal(item.tanggal)}</td><td className="hidden px-4 py-4 text-gray-600 md:table-cell md:px-6">{item.keterangan || '-'}</td><td className="whitespace-nowrap px-4 py-4 text-right sm:px-6"><button onClick={() => navigate(`/laporan-keuangan/${item.idLK}/edit`)} className="mr-2 inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100">Edit</button><button onClick={() => handleDelete(item.idLK)} className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100">Hapus</button></td></tr>)}</tbody></table></div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
