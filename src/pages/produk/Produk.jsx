import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import ProdukForm from './ProdukForm'
import { produkService } from '../../services/produkService'
import { assetUrl } from '../../services/api'
import { formatRupiah } from '../../utils/formatRupiah'
import { pesanError } from '../../utils/pesanError'

export default function Produk() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  const loadProduk = () => produkService.getAll()
    .then((data) => {
      setProduk(data)
      setError('')
    })
    .catch((err) => setError(pesanError(err, 'Gagal memuat produk.')))
    .finally(() => setLoading(false))

  useEffect(() => { loadProduk() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return
    try {
      await produkService.delete(id)
      setProduk((items) => items.filter((item) => item.idProduk !== id))
    } catch (err) {
      setError(pesanError(err, 'Gagal menghapus produk.'))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
            <p className="mt-1 text-sm text-gray-500">Tambah, lihat, ubah, dan hapus produk UMKM.</p>
          </div>
          <button onClick={() => setModal({ id: null })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ Tambah Produk</button>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? <div className="p-8 text-center text-gray-500">Memuat data...</div> : produk.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada produk. Tambahkan produk pertama.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr><th className="w-12 px-4 py-3.5 text-center sm:px-6">#</th><th className="w-20 px-4 py-3.5 sm:px-6">Gambar</th><th className="px-4 py-3.5 sm:px-6">Produk</th><th className="hidden px-4 py-3.5 sm:table-cell sm:px-6">Kategori</th><th className="px-4 py-3.5 sm:px-6">Harga</th><th className="hidden px-4 py-3.5 sm:table-cell sm:px-6">Status</th><th className="px-4 py-3.5 text-right sm:px-6">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produk.map((item) => (
                    <tr key={item.idProduk} className="transition hover:bg-indigo-50/40">
                      <td className="px-4 py-4 text-center text-gray-400 sm:px-6">{item.idProduk}</td>
                      <td className="px-4 py-4 sm:px-6">
                        {item.foto ? (
                          <img
                            src={assetUrl(item.foto)}
                            alt={item.namaProduk}
                            className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-200"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">—</div>
                        )}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <p className="font-medium text-gray-900">{item.namaProduk}</p>
                        {item.rasa?.length > 0 && <p className="mt-1 flex flex-wrap gap-1">{item.rasa.map((r) => <span key={r.idRasa} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">{r.namaRasa}</span>)}</p>}
                      </td>
                      <td className="hidden px-4 py-4 text-gray-600 sm:table-cell sm:px-6">{item.kategori?.namaKategori || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-gray-600 sm:px-6">{formatRupiah(item.harga)}</td>
                      <td className="hidden px-4 py-4 sm:table-cell sm:px-6"><span className={`rounded-full px-2 py-1 text-xs font-medium ${item.tampil ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.tampil ? 'Tampil' : 'Disembunyikan'}</span></td>
                      <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6"><button onClick={() => setModal({ id: item.idProduk })} className="mr-3 font-medium text-indigo-600 hover:text-indigo-800">Edit</button><button onClick={() => handleDelete(item.idProduk)} className="font-medium text-red-600 hover:text-red-800">Hapus</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {modal && <ProdukForm productId={modal.id} onClose={() => setModal(null)} onSaved={loadProduk} />}
      </div>
    </DashboardLayout>
  )
}
