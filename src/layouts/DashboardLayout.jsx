import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const isMobile = () => window.matchMedia('(max-width: 639px)').matches

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(isMobile)
  const [path, setPath] = useState(location.pathname)
  if (path !== location.pathname) {
    setPath(location.pathname)
    if (isMobile()) setCollapsed(true)
  }

  const closeSidebarOnMobile = () => {
    if (isMobile()) setCollapsed(true)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar collapsed={collapsed} onClose={closeSidebarOnMobile} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
