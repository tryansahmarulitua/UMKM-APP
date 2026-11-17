import api from './api'

export const produkService = {
  async getAll() {
    const { data } = await api.get('/produk')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/produk/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/produk', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async update(id, payload) {
    const { data } = await api.post(`/produk/${id}?_method=PUT`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async delete(id) {
    const { data } = await api.delete(`/produk/${id}`)
    return data
  },
}
