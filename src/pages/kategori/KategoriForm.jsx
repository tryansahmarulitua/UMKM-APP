import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { kategoriService } from '../../services/kategoriService'

export default function KategoriForm({ categoryId = null, onClose = null, onSaved = null }) {
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const id = categoryId || routeId
  const isModal = onClose !== null
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ namaKategori: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    kategoriService.getAll()
      .then((data) => {
        const kat = data.find(k => k.idKategori === parseInt(id))
        if (kat) setForm({ namaKategori: kat.namaKategori })
      })
      .catch(() => setError('Gagal memuat data kategori.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, namaKategori: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isEdit) {
        await kategoriService.update(id, form)
      } else {
        await kategoriService.store(form)
      }
      if (onSaved) onSaved()
      if (isModal) onClose()
      else navigate('/kategori')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat()[0] : err.response?.data?.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching && isModal) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><div className="rounded-xl bg-white p-6">Memuat data...</div></div>
  if (fetching) return <DashboardLayout><p className="p-6 text-gray-500">Memuat data...</p></DashboardLayout>

  const content = <form onSubmit={handleSubmit} className="space-y-5">
    {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div><label className="block text-sm font-medium text-gray-700">Nama Kategori</label><input type="text" value={form.namaKategori} onChange={handleChange} required maxLength={100} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nama kategori produk" /></div>
    <div className="flex gap-3 pt-2"><button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button><button type="button" onClick={() => (isModal ? onClose() : navigate('/kategori'))} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button></div>
  </form>

  if (isModal) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"><h2 className="mb-5 text-xl font-bold text-gray-900">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h2>{content}</div></div>

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h1>
          <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Perbarui data kategori.' : 'Isi data kategori baru.'}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">{content}</div>
      </div>
    </DashboardLayout>
  )
}
