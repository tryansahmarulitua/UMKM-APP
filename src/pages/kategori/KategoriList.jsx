import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import KategoriForm from './KategoriForm'
import { kategoriService } from '../../services/kategoriService'

export default function KategoriList() {
  const navigate = useNavigate()
  const [kategoris, setKategoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  const loadKategori = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await kategoriService.getAll()
      setKategoris(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat kategori.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadKategori() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return
    try {
      await kategoriService.destroy(id)
      setKategoris((items) => items.filter(item => item.idKategori !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus kategori.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola kategori produk UMKM.</p>
          </div>
          <button onClick={() => setModal({ id: null })} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">+ Tambah Kategori</button>
        </div>

        {error && <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Memuat data...</div>
          ) : kategoris.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">Belum ada kategori. Tambahkan kategori pertama.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5 w-12 text-center">#</th>
                    <th className="px-6 py-3.5">Nama Kategori</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kategoris.map((k, i) => (
                    <tr key={k.idKategori} className="transition hover:bg-indigo-50/40">
                      <td className="px-6 py-4 text-center text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{k.namaKategori}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setModal({ id: k.idKategori })}
                          className="mr-2 inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(k.idKategori)}
                          className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {modal && <KategoriForm categoryId={modal.id} onClose={() => setModal(null)} onSaved={loadKategori} />}
      </div>
    </DashboardLayout>
  )
}
