import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { pesanError } from '../../utils/pesanError'

const inputClass = 'w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

function PasswordToggle({ visible, onClick, label }) {
  return <button type="button" onClick={onClick} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={`${visible ? 'Sembunyikan' : 'Tampilkan'} ${label}`}>
    {visible ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zm4.95-4.95L4.05 19.95" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
  </button>
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (action) => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await action()
    } catch (err) {
      setError(pesanError(err, 'Terjadi kesalahan. Silakan coba lagi.'))
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = (event) => {
    event.preventDefault()
    submit(async () => {
      await authService.kirimOtp(email)
      setMessage('OTP dikirim. Periksa inbox atau folder spam email Anda.')
      setStep(2)
    })
  }

  const verifyOtp = (event) => {
    event.preventDefault()
    submit(async () => {
      await authService.verifikasiOtp(email, otp)
      setStep(3)
    })
  }

  const resetPassword = (event) => {
    event.preventDefault()
    if (password !== confirmation) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    submit(async () => {
      await authService.resetPassword(email, password, confirmation)
      setMessage('Password berhasil diubah. Silakan masuk dengan password baru.')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">B</div>
          <h1 className="text-2xl font-bold text-gray-900">Lupa password?</h1>
          <p className="mt-2 text-sm text-gray-600">Pulihkan akses Admin Bunda Riris dengan aman.</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          {['Email', 'Verifikasi', 'Password'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step > index ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{index + 1}</div>
              <span className={`ml-2 hidden text-xs sm:block ${step > index ? 'font-medium text-indigo-600' : 'text-gray-500'}`}>{label}</span>
              {index < 2 && <div className={`mx-2 h-px w-8 sm:w-12 ${step > index + 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}

        {step === 1 && <form onSubmit={sendOtp} className="space-y-5"><div><label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-gray-700">Email admin</label><input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="email admin" required /></div><button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Mengirim...' : 'Kirim kode OTP'}</button></form>}
        {step === 2 && <form onSubmit={verifyOtp} className="space-y-5"><div><label htmlFor="reset-otp" className="mb-1 block text-sm font-medium text-gray-700">Kode OTP</label><input id="reset-otp" inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} className={`${inputClass} text-center text-xl tracking-[0.5em]`} placeholder="000000" minLength={6} maxLength={6} required /><p className="mt-2 text-xs text-gray-500">Masukkan 6 digit kode dari email.</p></div><button disabled={loading || otp.length !== 6} className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Memverifikasi...' : 'Verifikasi kode'}</button><button type="button" onClick={() => setStep(1)} className="w-full text-sm text-indigo-600 hover:underline">Gunakan email lain</button></form>}
        {step === 3 && <form onSubmit={resetPassword} className="space-y-5"><div><label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">Password baru</label><div className="relative"><input id="new-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pr-12`} minLength={8} placeholder="Minimal 8 karakter" required /><PasswordToggle visible={showPassword} onClick={() => setShowPassword((value) => !value)} label="password baru" /></div></div><div><label htmlFor="password-confirmation" className="mb-1 block text-sm font-medium text-gray-700">Konfirmasi password</label><div className="relative"><input id="password-confirmation" type={showConfirmation ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={`${inputClass} pr-12`} minLength={8} placeholder="Ulangi password baru" required /><PasswordToggle visible={showConfirmation} onClick={() => setShowConfirmation((value) => !value)} label="konfirmasi password" /></div></div><button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan password'}</button></form>}

        <Link to="/login" className="mt-6 block text-center text-sm font-medium text-gray-600 hover:text-indigo-600">← Kembali ke login</Link>
      </div>
    </div>
  )
}
