import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const summaries = [
  { key: 'produk', label: 'Total Produk', icon: '▣', color: 'bg-blue-500' },
  { key: 'kategori', label: 'Kategori Produk', icon: '◈', color: 'bg-emerald-500' },
  { key: 'profil', label: 'Profil UMKM', icon: '◎', color: 'bg-violet-500' },
  { key: 'laporan', label: 'Laporan Keuangan', icon: '▤', color: 'bg-orange-500' },
]

const rupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)

export default function Dashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState({ produk: 0, kategori: 0, laporan: 0, totalModal: 0 })

  useEffect(() => {
    api.get('/auth/login-history').then(({ data }) => setSessions(data)).catch(() => {})
    Promise.all([
      api.get('/produk'),
      api.get('/kategori'),
      api.get('/laporan-keuangan'),
    ]).then(([produkRes, kategoriRes, laporanRes]) => {
      const laporan = laporanRes.data
      const totalModal = laporan.reduce((saldo, item) => (
        saldo + (item.jenis === 'Pemasukan' ? Number(item.jumlah) : -Number(item.jumlah))
      ), 0)
      setStats({
        produk: produkRes.data.length,
        kategori: kategoriRes.data.length,
        laporan: laporan.length,
        totalModal,
      })
    }).catch(() => {})
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Ringkasan pengelolaan UMKM Anda.</p>
        </div>

        {/* Kartu ringkasan */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <p className="mt-1 text-2xl font-bold text-gray-900">{item.key === 'profil' ? '1' : stats[item.key]}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl bg-indigo-600 p-5 text-white shadow-sm">
          <p className="text-sm text-indigo-100">Total Saldo</p>
          <p className="mt-1 text-2xl font-bold">{rupiah(stats.totalModal)}</p>
        </section>

        {/* Panel bawah */}
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
              Halo, <strong>{user?.name}</strong>. Kelola data produk, profil UMKM, kategori, dan laporan keuangan melalui menu navigasi di sidebar.
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
