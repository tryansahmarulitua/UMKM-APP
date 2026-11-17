import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { laporanService } from '../../services/laporanService'

export default function LaporanForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ namaSumber: '', jumlah: '', tanggal: '', keterangan: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    laporanService.getById(id)
      .then((data) => setForm({ namaSumber: data.namaSumber, jumlah: String(data.jumlah), tanggal: data.tanggal, keterangan: data.keterangan || '' }))
      .catch(() => setError('Gagal memuat data laporan.'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isEdit) { await laporanService.update(id, form) } else { await laporanService.store(form) }
      navigate('/laporan-keuangan')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat()[0] : err.response?.data?.message || 'Gagal menyimpan.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <DashboardLayout><p className="p-6 text-gray-500">Memuat data...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Catatan Keuangan' : 'Tambah Catatan Keuangan'}</h1>
          <p className="mt-1 text-sm text-gray-500">{isEdit ? 'Perbarui catatan sumber modal/keuangan.' : 'Tambahkan catatan sumber modal atau keuangan baru.'}</p>
        </div>

        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Sumber Modal/Keuangan</label>
            <input type="text" name="namaSumber" value={form.namaSumber} onChange={handleChange} required maxLength={100} placeholder="Contoh: Modal Sendiri, Pinjaman Bank, Hibah..." className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
            <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} required min="0" placeholder="0" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keterangan <span className="text-gray-400">(opsional)</span></label>
            <textarea name="keterangan" value={form.keterangan} onChange={handleChange} rows={3} maxLength={255} placeholder="Catatan tambahan..." className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            <button type="button" onClick={() => navigate('/laporan-keuangan')} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
