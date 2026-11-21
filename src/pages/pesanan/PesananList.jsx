import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import DetailPesanan from './DetailPesanan'
import { pesananService } from '../../services/pesananService'
import { formatRupiah } from '../../utils/formatRupiah'
import { pesanError } from '../../utils/pesanError'
import { formatWaktu, STATUS, WARNA_STATUS } from './statusPesanan'

export default function PesananList() {
  const [filter, setFilter] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dipilih, setDipilih] = useState(null)

  const load = useCallback(() => pesananService.getAll(filter)
    .then((data) => {
      setItems(data)
      setError('')
      return data
    })
    .catch((err) => setError(pesanError(err, 'Gagal memuat pesanan.')))
    .finally(() => setLoading(false)), [filter])

  useEffect(() => { load() }, [load])

  // After a status change: show the updated order, or reload everything if the change failed.
  async function handleChanged(baru) {
    const data = await load()
    setDipilih(baru ?? data?.find((item) => item.idPesanan === dipilih?.idPesanan) ?? null)
  }

  const tutup = useCallback(() => setDipilih(null), [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
          <p className="mt-1 max-w-3xl text-sm text-gray-500">Periksa bukti transfer di WhatsApp, lalu tandai pesanan sebagai Lunas. Pesanan Lunas otomatis tercatat sebagai pemasukan. Pesanan yang belum dibayar dalam 24 jam otomatis dibatalkan.</p>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status">
          {['', ...STATUS].map((status) => (
            <button key={status || 'semua'} type="button" onClick={() => { setLoading(true); setFilter(status) }} aria-pressed={filter === status}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === status ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'}`}>
              {status || 'Semua'}
            </button>
          ))}
        </div>

        {error && <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Memuat data...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">Belum ada pesanan{filter ? ` dengan status ${filter}` : ''}.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3.5 sm:px-6">Nomor</th>
                    <th className="hidden px-4 py-3.5 md:table-cell md:px-6">Waktu</th>
                    <th className="px-4 py-3.5 sm:px-6">Pelanggan</th>
                    <th className="hidden px-4 py-3.5 sm:table-cell sm:px-6">Pengiriman</th>
                    <th className="px-4 py-3.5 text-right sm:px-6">Total</th>
                    <th className="px-4 py-3.5 sm:px-6">Status</th>
                    <th className="px-4 py-3.5 text-right sm:px-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.idPesanan} className="transition hover:bg-indigo-50/40">
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 sm:px-6">{item.nomorPesanan}</td>
                      <td className="hidden whitespace-nowrap px-4 py-4 text-gray-600 md:table-cell md:px-6">{formatWaktu(item.created_at)}</td>
                      <td className="px-4 py-4 text-gray-900 sm:px-6">{item.namaPelanggan}</td>
                      <td className="hidden px-4 py-4 text-gray-600 sm:table-cell sm:px-6">{item.pengiriman}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-right tabular-nums text-gray-900 sm:px-6">{formatRupiah(item.total)}</td>
                      <td className="whitespace-nowrap px-4 py-4 sm:px-6"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${WARNA_STATUS[item.status]}`}>{item.status}</span></td>
                      <td className="px-4 py-4 text-right sm:px-6">
                        <button type="button" onClick={() => setDipilih(item)} className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {dipilih && <DetailPesanan key={`${dipilih.idPesanan}-${dipilih.status}`} pesanan={dipilih} onClose={tutup} onChanged={handleChanged} />}
      </div>
    </DashboardLayout>
  )
}
