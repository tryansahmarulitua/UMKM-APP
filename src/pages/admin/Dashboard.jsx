import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { profilService } from '../../services/profilService'
import { pesananService } from '../../services/pesananService'
import { formatRupiah } from '../../utils/formatRupiah'
import { saldo } from '../../utils/keuangan'

const summaries = [
  { key: 'menunggu', label: 'Menunggu Pembayaran', icon: '▧', color: 'bg-amber-500' },
  { key: 'produk', label: 'Total Produk', icon: '▣', color: 'bg-blue-500' },
  { key: 'kategori', label: 'Kategori Produk', icon: '◈', color: 'bg-emerald-500' },
  { key: 'profil', label: 'Profil UMKM', icon: '◎', color: 'bg-violet-500' },
  { key: 'laporan', label: 'Laporan Keuangan', icon: '▤', color: 'bg-orange-500' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState({ menunggu: 0, produk: 0, kategori: 0, profil: '-', laporan: 0, saldo: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/login-history').then(({ data }) => setSessions(data)).catch(() => {})
    pesananService.getAll('Menunggu Pembayaran').then((data) => setStats((prev) => ({ ...prev, menunggu: data.length }))).catch(() => {})
    Promise.all([
      api.get('/produk'),
      api.get('/kategori'),
      api.get('/laporan-keuangan'),
      profilService.get(),
    ]).then(([produkRes, kategoriRes, laporanRes, profil]) => {
      setStats((prev) => ({
        ...prev,
        produk: produkRes.data.length,
        kategori: kategoriRes.data.length,
        profil: profil ? 'Lengkap' : 'Belum diisi',
        laporan: laporanRes.data.length,
        saldo: saldo(laporanRes.data),
      }))
    }).catch(() => setError('Ringkasan belum bisa dimuat. Coba muat ulang halaman.'))
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Ringkasan pengelolaan UMKM Anda.</p>
        </div>

        {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {summaries.map((item) => (
            <article
              key={item.label}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl text-white ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats[item.key]}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm">
          <p className="text-sm text-indigo-100">Total Saldo</p>
          <p className="mt-1 text-2xl font-bold">{formatRupiah(stats.saldo)}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Login</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {sessions.length === 0 ? (
                <p className="py-3 text-sm text-gray-500">Belum ada riwayat login.</p>
              ) : sessions.map((s) => (
                <div key={s.id} className="py-3">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(s.last_activity * 1000).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  <p className="text-xs text-gray-400">{s.ip_address} &mdash; {s.user_agent?.slice(0, 60)}…</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Selamat Datang</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Halo, <strong>{user?.name}</strong>. Kelola pesanan, produk, profil UMKM, kategori, dan laporan keuangan melalui menu navigasi di sidebar.
            </p>
            <div className="mt-5 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
              Gunakan sidebar untuk mulai mengelola data UMKM Anda.
            </div>
          </article>
        </section>
      </div>
    </DashboardLayout>
  )
}
