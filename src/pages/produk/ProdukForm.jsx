import { useEffect, useState } from 'react'
import { assetUrl } from '../../services/api'
import { kategoriService, rasaService } from '../../services/labelService'
import { produkService } from '../../services/produkService'
import { pesanError } from '../../utils/pesanError'

const INPUT = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

// Add/edit product modal, opened from the Produk page.
export default function ProdukForm({ productId, onClose, onSaved }) {
  const isEdit = Boolean(productId)
  const [kategoris, setKategoris] = useState([])
  const [rasas, setRasas] = useState([])
  const [form, setForm] = useState({ idKategori: '', namaProduk: '', deskripsi: '', harga: '', tampil: 'Y', foto: null, rasa: [] })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    kategoriService.getAll().then(setKategoris).catch(() => setError('Gagal memuat daftar kategori.'))
    rasaService.getAll().then(setRasas).catch(() => setError('Gagal memuat daftar rasa.'))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    produkService.getById(productId)
      .then((data) => {
        setForm({ idKategori: String(data.idKategori), namaProduk: data.namaProduk, deskripsi: data.deskripsi, harga: String(data.harga), tampil: data.tampil ? 'Y' : 'N', foto: null, rasa: (data.rasa || []).map((r) => r.idRasa) })
        if (data.foto) setPreview(assetUrl(data.foto))
      })
      .catch(() => setError('Gagal memuat data produk.'))
      .finally(() => setFetching(false))
  }, [productId, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const toggleRasa = (id) => {
    setForm((prev) => ({ ...prev, rasa: prev.rasa.includes(id) ? prev.rasa.filter((r) => r !== id) : [...prev.rasa, id] }))
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
      const { rasa, ...fields } = form
      Object.entries(fields).forEach(([key, val]) => { if (val !== null && val !== '') payload.append(key, val) })
      // FormData cannot hold an empty array; an empty `rasa` tells the API to clear every label.
      if (rasa.length === 0) payload.append('rasa', '')
      rasa.forEach((id) => payload.append('rasa[]', id))
      await (isEdit ? produkService.update(productId, payload) : produkService.create(payload))
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-gray-900">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
        {fetching ? <p className="p-6 text-sm text-gray-400">Memuat data...</p> : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select name="idKategori" value={form.idKategori} onChange={handleChange} required className={INPUT}>
                <option value="">-- Pilih Kategori --</option>
                {kategoris.map((k) => <option key={k.idKategori} value={String(k.idKategori)}>{k.namaKategori}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
              <input type="text" name="namaProduk" value={form.namaProduk} onChange={handleChange} required maxLength={100} className={INPUT} placeholder="Nama produk" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} required rows={3} className={INPUT} placeholder="Deskripsi produk" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
              <input type="number" name="harga" value={form.harga} onChange={handleChange} required min="0" className={INPUT} placeholder="0" />
            </div>
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700">Label Rasa</legend>
              <p className="text-xs text-gray-500">Dipakai chatbot untuk merekomendasikan produk sesuai selera pembeli.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {rasas.map((r) => (
                  <label key={r.idRasa} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${form.rasa.includes(r.idRasa) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="checkbox" className="sr-only" checked={form.rasa.includes(r.idRasa)} onChange={() => toggleRasa(r.idRasa)} />
                    {r.namaRasa}
                  </label>
                ))}
                {rasas.length === 0 && <span className="text-sm text-gray-400">Belum ada label rasa.</span>}
              </div>
            </fieldset>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status Tampil</label>
              <select name="tampil" value={form.tampil} onChange={handleChange} className={INPUT}>
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
              <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
