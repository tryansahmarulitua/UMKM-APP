import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { profilService } from '../../services/profilService'

export default function Profil() {
  const [form, setForm] = useState({
    namaUMKM: '',
    deskripsi: '',
    alamat: '',
    noTelepon: '',
    email: '',
    mediaSosial: '',
    foto: null,
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    profilService.get()
      .then((data) => {
        if (!data) return
        setForm((prev) => ({
          ...prev,
          namaUMKM: data.namaUMKM || '',
          deskripsi: data.deskripsi || '',
          alamat: data.alamat || '',
          noTelepon: data.noTelepon || '',
          email: data.email || '',
          mediaSosial: data.mediaSosial || '',
        }))
        if (data.foto) setPreview(`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${data.foto}`)
      })
      .catch(() => setMessage({ type: 'error', text: 'Gagal memuat profil.' }))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setMessage({ type: '', text: '' })
  }

  const handlePhoto = (e) => {
    const foto = e.target.files[0]
    if (!foto) return
    setForm((prev) => ({ ...prev, foto }))
    setPreview(URL.createObjectURL(foto))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') payload.append(key, value)
      })
      await profilService.save(payload)
      setMessage({ type: 'success', text: 'Profil berhasil disimpan.' })
    } catch (err) {
      const errors = err.response?.data?.errors
      setMessage({ type: 'error', text: errors ? Object.values(errors).flat()[0] : err.response?.data?.message || 'Gagal menyimpan profil.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p className="text-gray-500">Memuat profil...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil UMKM</h1>
          <p className="mt-1 text-sm text-gray-500">Perbarui informasi usaha, kontak, foto, dan media sosial.</p>
        </div>

        {message.text && <div className={`rounded-lg p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
              <input name="namaUMKM" value={form.namaUMKM} onChange={handleChange} required maxLength={100} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nama usaha" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Deskripsi Usaha</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} required rows={4} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Jelaskan usaha Anda" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <textarea name="alamat" value={form.alamat} onChange={handleChange} required rows={3} maxLength={255} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Alamat lengkap usaha" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input name="noTelepon" value={form.noTelepon} onChange={handleChange} required maxLength={20} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="08xxxxxxxxxx" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Usaha <span className="text-gray-400">(opsional)</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} maxLength={100} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="usaha@email.com" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Media Sosial <span className="text-gray-400">(opsional)</span></label>
              <input name="mediaSosial" value={form.mediaSosial} onChange={handleChange} maxLength={255} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Instagram, Facebook, atau TikTok" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Foto Usaha <span className="text-gray-400">(opsional)</span></label>
              {preview && <img src={preview} alt="Preview usaha" className="mt-2 h-32 w-32 rounded-lg object-cover ring-1 ring-gray-200" />}
              <input type="file" accept="image/*" onChange={handlePhoto} className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan Profil'}</button>
        </form>
      </div>
    </DashboardLayout>
  )
}
