import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { produkService } from '../../services/produkService'
import { assetUrl } from '../../services/api'
import api from '../../services/api'

const FORM_DEFAULT = { idKategori: '', namaProduk: '', deskripsi: '', harga: '', tampil: 'Y', foto: null }

const FormContent = ({ kategoris, form, preview, loading, fetching, error, handleChange, handleFile, handleSubmit, isEdit, onCancel }) => {
  if (fetching) return <p className="p-6 text-sm text-gray-400">Memuat data...</p>
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <select name="idKategori" value={form.idKategori} onChange={handleChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="">-- Pilih Kategori --</option>
          {kategoris.map((k) => <option key={k.idKategori} value={String(k.idKategori)}>{k.namaKategori}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
        <input type="text" name="namaProduk" value={form.namaProduk} onChange={handleChange} required maxLength={100} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nama produk" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} required rows={3} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Deskripsi produk" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
        <input type="number" name="harga" value={form.harga} onChange={handleChange} required min="0" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="0" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status Tampil</label>
        <select name="tampil" value={form.tampil} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <option value="Y">Tampilkan</option>
          <option value="N">Sembunyikan</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Foto Produk</label>
        {preview && <img src={preview} alt="preview" className="mt-2 h-28 w-28 rounded-lg object-cover ring-1 ring-gray-200" />}
        <input type="file" accept="image/*" onChange={handleFile} className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
      </div>
    </form>
  )
}

export default function ProdukForm({ productId = null, onClose = null, onSaved = null }) {
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const id = productId || routeId
  const isModal = onClose !== null
  const isEdit = Boolean(id)

  const [kategoris, setKategoris] = useState([])
  const [form, setForm] = useState({ idKategori: '', namaProduk: '', deskripsi: '', harga: '', tampil: 'Y', foto: null })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  // Load kategori list
  useEffect(() => {
    api.get('/kategori').then(({ data }) => setKategoris(data)).catch(() => {})
  }, [])

  // Load existing produk when editing
  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    produkService.getById(id)
      .then((data) => {
        setForm({ idKategori: String(data.idKategori), namaProduk: data.namaProduk, deskripsi: data.deskripsi, harga: String(data.harga), tampil: data.tampil ? 'Y' : 'N', foto: null })
        if (data.foto) setPreview(assetUrl(data.foto))
      })
      .catch(() => setError('Gagal memuat data produk.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm((prev) => ({ ...prev, foto: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, val]) => { if (val !== null && val !== '') payload.append(key, val) })

      if (isEdit) {
        await produkService.update(id, payload)
      } else {
        await produkService.create(payload)
      }
      if (onSaved) onSaved()
      if (isModal) onClose()
      else navigate('/produk')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat()[0] : err.response?.data?.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  const content = <FormContent kategoris={kategoris} form={form} preview={preview} loading={loading} fetching={fetching} error={error} handleChange={handleChange} handleFile={handleFile} handleSubmit={handleSubmit} isEdit={isEdit} onCancel={() => (isModal ? onClose() : navigate('/produk'))} />

  if (isModal) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-gray-900">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
        {content}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
          <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Perbarui data produk.' : 'Isi data produk baru.'}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          {content}
        </div>
      </div>
    </DashboardLayout>
  )
}
