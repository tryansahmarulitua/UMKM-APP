import api from './api'

export const profilService = {
  async get() {
    try {
      const { data } = await api.get('/profil')
      return data
    } catch (err) {
      if (err.response?.status === 404) return null
      throw err
    }
  },

  async save(payload) {
    const { data } = await api.post('/profil', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
