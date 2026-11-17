import api from './api'

export const laporanService = {
  async getAll() {
    const { data } = await api.get('/laporan-keuangan')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/laporan-keuangan/${id}`)
    return data
  },

  async store(payload) {
    const { data } = await api.post('/laporan-keuangan', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/laporan-keuangan/${id}`, payload)
    return data
  },

  async destroy(id) {
    const { data } = await api.delete(`/laporan-keuangan/${id}`)
    return data
  },
}
