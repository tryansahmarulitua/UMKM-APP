import api from './api'

export const kategoriService = {
  async getAll() {
    const { data } = await api.get('/kategori')
    return data
  },

  async store(payload) {
    const { data } = await api.post('/kategori', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/kategori/${id}`, payload)
    return data
  },

  async destroy(id) {
    const { data } = await api.delete(`/kategori/${id}`)
    return data
  },
}