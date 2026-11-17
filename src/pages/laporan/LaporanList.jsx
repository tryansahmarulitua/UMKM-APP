import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { laporanService } from '../../services/laporanService'

const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
const formatTanggal = (value) => value ? String(value).slice(0, 10) : '-'

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

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1><p className="mt-1 text-sm text-gray-500">Catatan sumber modal dan keuangan usaha.</p></div>
          <button onClick={() => navigate('/laporan-keuangan/tambah')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah Catatan</button>
        </div>
        <div className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm"><p className="text-sm text-indigo-100">Total Saldo</p><p className="mt-1 text-2xl font-bold">{rupiah(total)}</p></div>
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? <div className="p-10 text-center text-sm text-gray-400">Memuat data...</div> : items.length === 0 ? <div className="p-10 text-center text-sm text-gray-400">Belum ada catatan keuangan.</div> : (
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-3.5">Jenis</th><th className="px-6 py-3.5">Sumber</th><th className="px-6 py-3.5">Jumlah</th><th className="px-6 py-3.5">Tanggal</th><th className="px-6 py-3.5">Keterangan</th><th className="px-6 py-3.5 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-gray-100">{items.map((item) => <tr key={item.idLK} className="transition hover:bg-indigo-50/40"><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.jenis === 'Pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.jenis}</span></td><td className="px-6 py-4 font-medium text-gray-900">{item.namaSumber}</td><td className="px-6 py-4 text-gray-700">{rupiah(item.jumlah)}</td><td className="px-6 py-4 text-gray-600">{formatTanggal(item.tanggal)}</td><td className="px-6 py-4 text-gray-600">{item.keterangan || '-'}</td><td className="px-6 py-4 text-right"><button onClick={() => navigate(`/laporan-keuangan/${item.idLK}/edit`)} className="mr-2 inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100">Edit</button><button onClick={() => handleDelete(item.idLK)} className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100">Hapus</button></td></tr>)}</tbody></table></div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
