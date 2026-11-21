import { useEffect, useState } from 'react'
import { laporanService } from '../../services/laporanService'
import { formatRupiah as rupiah } from '../../utils/formatRupiah'
import { labelPeriode } from '../../utils/keuangan'
import { pesanError } from '../../utils/pesanError'

const PERIODE = [
  { value: 'harian', label: 'Harian' },
  { value: 'mingguan', label: 'Mingguan' },
  { value: 'bulanan', label: 'Bulanan' },
]

const bulanIni = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const angka = (value, className = '') => <td className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${className}`}>{value ? rupiah(value) : '-'}</td>

// Daily, weekly and monthly summary calculated by the API. `versi` changes whenever records change, to reload it.
export default function RingkasanKeuangan({ versi }) {
  const [periode, setPeriode] = useState('bulanan')
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [bulan, setBulan] = useState(bulanIni)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let aktif = true
    const params = periode === 'bulanan' ? { periode, tahun } : { periode, bulan }
    laporanService.ringkasan(params)
      .then((res) => { if (aktif) { setData(res); setError('') } })
      .catch((err) => { if (aktif) setError(pesanError(err, 'Gagal memuat ringkasan.')) })
    return () => { aktif = false }
  }, [periode, tahun, bulan, versi])

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Ringkasan</h2>
          <p className="mt-1 text-sm text-gray-500">Laba = pemasukan − pengeluaran. Modal menambah saldo, tapi tidak dihitung sebagai laba.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm" role="group" aria-label="Periode ringkasan">
            {PERIODE.map((p) => (
              <button key={p.value} type="button" onClick={() => setPeriode(p.value)} aria-pressed={periode === p.value}
                className={`px-3 py-1.5 font-medium transition ${periode === p.value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {p.label}
              </button>
            ))}
          </div>
          {periode === 'bulanan' ? (
            <select value={tahun} onChange={(e) => setTahun(Number(e.target.value))} aria-label="Tahun" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
              {(data?.tahunTersedia ?? [tahun]).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          ) : (
            <input type="month" value={bulan} onChange={(e) => e.target.value && setBulan(e.target.value)} aria-label="Bulan" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" />
          )}
        </div>
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {data && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Periode</th>
                <th className="px-4 py-3 text-right">Modal</th>
                <th className="px-4 py-3 text-right">Pemasukan</th>
                <th className="px-4 py-3 text-right">Pengeluaran</th>
                <th className="px-4 py-3 text-right">Laba</th>
                <th className="px-4 py-3 text-right">Saldo akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="text-gray-500">
                <td className="px-4 py-3" colSpan={5}>Saldo awal</td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{rupiah(data.saldoAwal)}</td>
              </tr>
              {data.rincian.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-gray-400" colSpan={6}>Belum ada catatan pada periode ini.</td></tr>
              )}
              {data.rincian.map((row) => (
                <tr key={row.mulai}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{labelPeriode(data.periode, row)}</td>
                  {angka(row.modal, 'text-indigo-700')}
                  {angka(row.pemasukan, 'text-green-700')}
                  {angka(row.pengeluaran, 'text-red-600')}
                  <td className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${row.laba < 0 ? 'text-red-600' : 'text-gray-900'}`}>{rupiah(row.laba)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{rupiah(row.saldoAkhir)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200 font-semibold text-gray-900">
              <tr>
                <td className="px-4 py-3">Total</td>
                {angka(data.total.modal)}
                {angka(data.total.pemasukan)}
                {angka(data.total.pengeluaran)}
                <td className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${data.total.laba < 0 ? 'text-red-600' : ''}`}>{rupiah(data.total.laba)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{rupiah(data.total.saldoAkhir)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  )
}
