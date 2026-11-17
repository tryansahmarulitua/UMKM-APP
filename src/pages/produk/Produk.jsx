import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { produkService } from '../../services/produkService'

const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

export default function Produk() {
  const navigate = useNavigate()
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProduk = async () => {
    try {
      setLoading(true)
      setProduk(await produkService.getAll())
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat produk.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProduk() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return
    try {
      await produkService.delete(id)
      setProduk((items) => items.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus produk.')
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="mt-1 text-sm text-gray-500">Tambah, lihat, ubah, dan hapus produk UMKM.</p>
          </div>
          <button onClick={() => navigate('/produk/tambah')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah Produk</button>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? <div className="p-8 text-center text-gray-500">Memuat data...</div> : produk.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada produk. Tambahkan produk pertama.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr><th className="px-6 py-3">Produk</th><th className="px-6 py-3">Kategori</th><th className="px-6 py-3">Harga</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produk.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.namaProduk}</td>
                      <td className="px-6 py-4 text-gray-600">{item.kategori?.namaKategori || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{formatRupiah(item.harga)}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-medium ${item.tampil === 'Y' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.tampil === 'Y' ? 'Tampil' : 'Disembunyikan'}</span></td>
                      <td className="px-6 py-4 text-right"><button onClick={() => navigate(`/produk/${item.id}/edit`)} className="mr-3 font-medium text-indigo-600 hover:text-indigo-800">Edit</button><button onClick={() => handleDelete(item.id)} className="font-medium text-red-600 hover:text-red-800">Hapus</button></td>
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
