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
}
