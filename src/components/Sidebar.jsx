import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard',       path: '/dashboard',        icon: '▦' },
  { label: 'Produk',          path: '/produk',           icon: '▣' },
  { label: 'Kategori Produk', path: '/kategori',         icon: '◈' },
  { label: 'Profil UMKM',     path: '/profil',           icon: '◎' },
  { label: 'Laporan Keuangan',path: '/laporan-keuangan', icon: '▤' },
]

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`flex shrink-0 flex-col bg-slate-900 text-white transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Brand */}
      <div className={`border-b border-slate-700 py-5 ${collapsed ? 'px-3' : 'px-6'}`}>
        {collapsed ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold">U</span>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Admin Panel</p>
            <p className="mt-1 text-lg font-bold">UMKM Jatisampurna</p>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg py-3 text-sm font-medium transition
              ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}
              ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-slate-700 px-6 py-4 text-xs text-slate-400">Admin UMKM</div>
      )}
    </aside>
  )
}
