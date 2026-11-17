import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { laporanService } from '../../services/laporanService'

const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

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
    try { await laporanService.destroy(id); setItems((prev) => prev.filter((item) => item.id !== id)) } catch (err) { setError(err.response?.data?.message || 'Gagal menghapus laporan.') }
  }

  const total = items.reduce((sum, item) => sum + Number(item.jumlah), 0)

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1><p className="mt-1 text-sm text-gray-500">Catatan sumber modal dan keuangan usaha.</p></div>
          <button onClick={() => navigate('/laporan-keuangan/tambah')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah Catatan</button>
        </div>
        <div className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm"><p className="text-sm text-indigo-100">Total Catatan Keuangan</p><p className="mt-1 text-2xl font-bold">{rupiah(total)}</p></div>
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? <div className="p-8 text-center text-gray-500">Memuat data...</div> : items.length === 0 ? <div className="p-8 text-center text-gray-500">Belum ada catatan keuangan.</div> : (
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-3">Sumber</th><th className="px-6 py-3">Jumlah</th><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3">Keterangan</th><th className="px-6 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-gray-100">{items.map((item) => <tr key={item.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium text-gray-900">{item.namaSumber}</td><td className="px-6 py-4 text-gray-700">{rupiah(item.jumlah)}</td><td className="px-6 py-4 text-gray-600">{item.tanggal}</td><td className="px-6 py-4 text-gray-600">{item.keterangan || '-'}</td><td className="px-6 py-4 text-right"><button onClick={() => navigate(`/laporan-keuangan/${item.id}/edit`)} className="mr-3 font-medium text-indigo-600 hover:text-indigo-800">Edit</button><button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 hover:text-red-800">Hapus</button></td></tr>)}</tbody></table></div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
