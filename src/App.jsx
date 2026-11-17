import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './layouts/ProtectedRoute'
import GuestRoute from './layouts/GuestRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import Produk from './pages/produk/Produk'
import ProdukForm from './pages/produk/ProdukTambahEdit'
import KategoriList from './pages/kategori/KategoriList'
import KategoriForm from './pages/kategori/KategoriForm'
import Profil from './pages/profil/Profil'
import LaporanList from './pages/laporan/LaporanList'
import LaporanForm from './pages/laporan/LaporanForm'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/produk/tambah" element={<ProdukForm />} />
            <Route path="/produk/:id/edit" element={<ProdukForm />} />
            <Route path="/kategori" element={<KategoriList />} />
            <Route path="/kategori/tambah" element={<KategoriForm />} />
            <Route path="/kategori/:id/edit" element={<KategoriForm />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/laporan-keuangan" element={<LaporanList />} />
            <Route path="/laporan-keuangan/tambah" element={<LaporanForm />} />
            <Route path="/laporan-keuangan/:id/edit" element={<LaporanForm />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
