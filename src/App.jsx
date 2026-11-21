import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './layouts/ProtectedRoute'
import GuestRoute from './layouts/GuestRoute'
import Login from './pages/auth/Login'
import Dashboard from './pages/admin/Dashboard'
import Produk from './pages/produk/Produk'
import DaftarLabel from './pages/label/DaftarLabel'
import { KATEGORI, RASA } from './pages/label/jenisLabel'
import Profil from './pages/profil/Profil'
import LaporanList from './pages/laporan/LaporanList'
import LaporanForm from './pages/laporan/LaporanForm'
import PesananList from './pages/pesanan/PesananList'
import Pengaturan from './pages/pengaturan/Pengaturan'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/kategori" element={<DaftarLabel key="kategori" jenis={KATEGORI} />} />
            <Route path="/rasa" element={<DaftarLabel key="rasa" jenis={RASA} />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/laporan-keuangan" element={<LaporanList />} />
            <Route path="/laporan-keuangan/tambah" element={<LaporanForm />} />
            <Route path="/laporan-keuangan/:id/edit" element={<LaporanForm />} />
            <Route path="/pesanan" element={<PesananList />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
