import api from './api'

export const authService = {
  async login(credentials, turnstile) {
    const { data } = await api.post('/auth/login', { ...credentials, turnstile })
    return data
  },

  async logout() {
    const { data } = await api.post('/auth/logout')
    return data
  },

  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async kirimOtp(email) {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  async verifikasiOtp(email, otp) {
    const { data } = await api.post('/auth/verify-otp', { email, otp })
    return data
  },

  async resetPassword(email, password, password_confirmation) {
    const { data } = await api.post('/auth/reset-password', { email, password, password_confirmation })
    return data
  },
}
