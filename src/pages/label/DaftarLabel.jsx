import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import LabelForm from './LabelForm'
import { pesanError } from '../../utils/pesanError'

// List page for categories or flavour labels (see jenisLabel.js).
// App.jsx gives each page its own `key`, so switching between them remounts this component.
export default function DaftarLabel({ jenis }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // { item }, where item is null when adding

  const namaKecil = jenis.nama.toLowerCase()

  const load = () => jenis.service.getAll()
    .then((data) => {
      setItems(data)
      setError('')
    })
    .catch((err) => setError(pesanError(err, `Gagal memuat ${namaKecil}.`)))
    .finally(() => setLoading(false))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [])

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus ${namaKecil} "${item[jenis.namaKey]}"?`)) return
    try {
      await jenis.service.destroy(item[jenis.idKey])
      setItems((rows) => rows.filter((row) => row[jenis.idKey] !== item[jenis.idKey]))
    } catch (err) {
      setError(pesanError(err, `Gagal menghapus ${namaKecil}.`))
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{jenis.judul}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{jenis.keterangan}</p>
          </div>
          <button onClick={() => setModal({ item: null })} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">+ Tambah {jenis.nama}</button>
        </div>

        {error && <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Memuat data...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">Belum ada {namaKecil}. Tambahkan yang pertama.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-12 px-6 py-3.5 text-center">#</th>
                    <th className="px-6 py-3.5">Nama {jenis.nama}</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, i) => (
                    <tr key={item[jenis.idKey]} className="transition hover:bg-indigo-50/40">
                      <td className="px-6 py-4 text-center text-gray-400">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item[jenis.namaKey]}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setModal({ item })} className="mr-2 inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100">Edit</button>
                        <button onClick={() => handleDelete(item)} className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {modal && <LabelForm jenis={jenis} item={modal.item} onClose={() => setModal(null)} onSaved={load} />}
      </div>
    </DashboardLayout>
  )
}
