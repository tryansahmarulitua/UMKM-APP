import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'

const summaries = [
  { label: 'Total Produk',       value: '0', icon: '▣', color: 'bg-blue-500'    },
  { label: 'Kategori Produk',    value: '0', icon: '◈', color: 'bg-emerald-500' },
  { label: 'Profil UMKM',        value: '1', icon: '◎', color: 'bg-violet-500'  },
  { label: 'Laporan Keuangan',   value: '0', icon: '▤', color: 'bg-orange-500'  },
]

const activities = [
  'Belum ada aktivitas produk.',
  'Belum ada laporan keuangan.',
  'Lengkapi profil UMKM Anda.',
]

export default function Dashboard() {
  const { user } = useAuth()

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
                <p className="mt-1 text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Panel bawah */}
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
            <div className="mt-4 divide-y divide-gray-100">
              {activities.map((a) => (
                <p key={a} className="py-3 text-sm text-gray-500">{a}</p>
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
