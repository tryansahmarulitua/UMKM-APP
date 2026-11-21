import { useEffect, useState } from 'react'
import { kategoriService } from '../../services/kategoriService'
import { pesanError } from '../../utils/pesanError'

// Add/edit category modal, opened from the Kategori page.
export default function KategoriForm({ categoryId, onClose, onSaved }) {
  const isEdit = Boolean(categoryId)
  const [form, setForm] = useState({ namaKategori: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    kategoriService.getAll()
      .then((data) => {
        const kat = data.find((k) => k.idKategori === Number(categoryId))
        if (kat) setForm({ namaKategori: kat.namaKategori })
      })
      .catch(() => setError('Gagal memuat data kategori.'))
      .finally(() => setFetching(false))
  }, [categoryId, isEdit])

  const handleChange = (e) => {
    setForm({ namaKategori: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await (isEdit ? kategoriService.update(categoryId, form) : kategoriService.store(form))
      onSaved()
      onClose()
    } catch (err) {
      setError(pesanError(err, 'Gagal menyimpan.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-gray-900">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
        {fetching ? <p className="text-sm text-gray-400">Memuat data...</p> : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input type="text" value={form.namaKategori} onChange={handleChange} required maxLength={20} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nama kategori produk" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
