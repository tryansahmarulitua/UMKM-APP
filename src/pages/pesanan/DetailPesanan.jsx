import { useEffect, useState } from 'react'
import { pesananService } from '../../services/pesananService'
import { formatRupiah } from '../../utils/formatRupiah'
import { pesanError } from '../../utils/pesanError'
import { formatWaktu, LANGKAH_BERIKUTNYA, linkWhatsApp, WARNA_STATUS } from './statusPesanan'

// Order detail modal with the status buttons that are valid for the current status.
export default function DetailPesanan({ pesanan, onClose, onChanged }) {
  const [menyimpan, setMenyimpan] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const tutup = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', tutup)
    return () => window.removeEventListener('keydown', tutup)
  }, [onClose])

  async function ubah(langkah) {
    if (!window.confirm(langkah.konfirmasi)) return
    setMenyimpan(true)
    setError('')
    try {
      const { pesanan: baru } = await pesananService.ubahStatus(pesanan.idPesanan, langkah.status)
      onChanged(baru)
    } catch (err) {
      setError(pesanError(err, 'Status belum bisa diubah.'))
      // The order may have been cancelled automatically in the meantime; refresh the list.
      onChanged(null)
    } finally {
      setMenyimpan(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-label={`Pesanan ${pesanan.nomorPesanan}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{pesanan.nomorPesanan}</h2>
            <p className="mt-1 text-sm text-gray-500">{formatWaktu(pesanan.created_at)}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${WARNA_STATUS[pesanan.status]}`}>{pesanan.status}</span>
        </div>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Pelanggan</dt><dd className="font-medium text-gray-900">{pesanan.namaPelanggan}</dd>
          <dt className="text-gray-500">WhatsApp</dt>
          <dd><a className="font-medium text-indigo-600 hover:underline" href={linkWhatsApp(pesanan.noWhatsApp, pesanan.nomorPesanan)} target="_blank" rel="noopener noreferrer">+{pesanan.noWhatsApp}</a></dd>
          <dt className="text-gray-500">Pengiriman</dt><dd className="text-gray-900">{pesanan.pengiriman}</dd>
          <dt className="text-gray-500">Tanggal lunas</dt><dd className="text-gray-900">{formatWaktu(pesanan.tanggalLunas)}</dd>
        </dl>

        <table className="mt-5 w-full text-sm">
          <thead className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr><th className="py-2">Produk</th><th className="py-2 text-right">Jumlah</th><th className="py-2 text-right">Subtotal</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pesanan.detail.map((item) => (
              <tr key={item.idDetail}>
                <td className="py-2 text-gray-900">{item.namaProduk}<span className="block text-xs text-gray-500">{formatRupiah(item.harga)}</span></td>
                <td className="py-2 text-right tabular-nums">{item.jumlah}</td>
                <td className="py-2 text-right tabular-nums">{formatRupiah(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-200 font-semibold">
            <tr><td className="py-2" colSpan={2}>Total</td><td className="py-2 text-right tabular-nums">{formatRupiah(pesanan.total)}</td></tr>
          </tfoot>
        </table>
        {pesanan.pengiriman === 'Dikirim' && <p className="mt-2 text-xs text-gray-500">Total belum termasuk ongkos kirim, yang dikonfirmasi lewat WhatsApp.</p>}

        {error && <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex flex-wrap gap-3">
          {LANGKAH_BERIKUTNYA[pesanan.status].map((langkah) => (
            <button key={langkah.status} type="button" disabled={menyimpan} onClick={() => ubah(langkah)} className={`rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-50 ${langkah.gaya}`}>
              {langkah.label}
            </button>
          ))}
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Tutup</button>
        </div>
      </div>
    </div>
  )
}
