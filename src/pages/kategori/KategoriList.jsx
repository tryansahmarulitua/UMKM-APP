import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { kategoriService } from '../../services/kategoriService'

export default function KategoriList() {
  const navigate = useNavigate()
  const [kategoris, setKategoris] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      setKategoris((items) => items.filter(item => item.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus kategori.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Kategori</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola kategori produk UMKM.</p>
          </div>
          <button onClick={() => navigate('/kategori/tambah')} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">+ Tambah Kategori</button>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : kategoris.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada kategori. Tambahkan kategori pertama.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Nama Kategori</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kategoris.map((k) => (
                    <tr key={k.idKategori} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{k.namaKategori}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => navigate(`/kategori/${k.idKategori}/edit`)} className="mr-3 font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                        <button onClick={() => handleDelete(k.idKategori)} className="font-medium text-red-600 hover:text-red-800">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
