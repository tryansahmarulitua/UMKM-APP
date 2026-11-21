import { useState } from 'react'
import { pesanError } from '../../utils/pesanError'

// Add/edit modal for a category or flavour label. `item` is null when adding.
export default function LabelForm({ jenis, item, onClose, onSaved }) {
  const isEdit = Boolean(item)
  const [nama, setNama] = useState(item?.[jenis.namaKey] ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = { [jenis.namaKey]: nama }
    try {
      await (isEdit ? jenis.service.update(item[jenis.idKey], payload) : jenis.service.store(payload))
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
        <h2 className="mb-5 text-xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Tambah'} {jenis.nama}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div>
            <label htmlFor="nama-label" className="block text-sm font-medium text-gray-700">Nama {jenis.nama}</label>
            <input id="nama-label" type="text" value={nama} onChange={(e) => { setNama(e.target.value); setError('') }} required maxLength={20} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder={jenis.placeholder} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan'}</button>
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          </div>
        </form>
      </div>
    </div>
  )
}
