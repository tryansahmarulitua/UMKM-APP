import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { pengaturanService } from '../../services/pesananService'
import { pesanError } from '../../utils/pesanError'

const INPUT = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
const KOSONG = { namaBank: '', nomorRekening: '', atasNama: '', nomorWhatsApp: '' }

// Transfer account and WhatsApp number shown to customers after checkout (Project Plan §1.2, FT11).
export default function Pengaturan() {
  const [form, setForm] = useState(KOSONG)
  const [loading, setLoading] = useState(true)
  const [menyimpan, setMenyimpan] = useState(false)
  const [error, setError] = useState('')
  const [sukses, setSukses] = useState('')

  useEffect(() => {
    pengaturanService.get()
      .then((data) => setForm(Object.fromEntries(Object.keys(KOSONG).map((key) => [key, data[key] ?? '']))))
      .catch((err) => setError(pesanError(err, 'Gagal memuat pengaturan.')))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSukses('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMenyimpan(true)
    setError('')
    try {
      // Empty fields are sent as null so they can be cleared.
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim() || null]))
      const { pengaturan, message } = await pengaturanService.simpan(payload)
      setForm(Object.fromEntries(Object.keys(KOSONG).map((key) => [key, pengaturan[key] ?? ''])))
      setSukses(message)
    } catch (err) {
      setError(pesanError(err, 'Gagal menyimpan pengaturan.'))
    } finally {
      setMenyimpan(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="mt-1 text-sm text-gray-500">Rekening dan nomor WhatsApp ini tampil ke pembeli setelah checkout.</p>
        </div>

        {error && <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {sukses && <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-700">{sukses}</div>}

        {loading ? <p className="text-sm text-gray-400">Memuat data...</p> : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold text-gray-900">Rekening tujuan transfer</legend>
              <label className="block text-sm font-medium text-gray-700">Nama bank
                <input name="namaBank" value={form.namaBank} onChange={handleChange} maxLength={50} className={INPUT} placeholder="Contoh: BCA" />
              </label>
              <label className="block text-sm font-medium text-gray-700">Nomor rekening
                <input name="nomorRekening" value={form.nomorRekening} onChange={handleChange} maxLength={30} inputMode="numeric" className={INPUT} placeholder="Contoh: 1234567890" />
              </label>
              <label className="block text-sm font-medium text-gray-700">Atas nama
                <input name="atasNama" value={form.atasNama} onChange={handleChange} maxLength={100} className={INPUT} placeholder="Nama pemilik rekening" />
              </label>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-lg font-semibold text-gray-900">WhatsApp pemesanan</legend>
              <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp
                <input name="nomorWhatsApp" value={form.nomorWhatsApp} onChange={handleChange} maxLength={20} type="tel" inputMode="tel" className={INPUT} placeholder="Contoh: 081234567890" />
              </label>
              <p className="text-xs text-gray-500">Pembeli mengirim pesanan dan bukti transfer ke nomor ini. Kalau dikosongkan, nomor telepon di Profil UMKM yang dipakai.</p>
            </fieldset>

            <button type="submit" disabled={menyimpan} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{menyimpan ? 'Menyimpan...' : 'Simpan'}</button>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
