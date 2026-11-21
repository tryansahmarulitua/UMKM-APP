import api from './api'

export const pesananService = {
  // Opening the list also cancels orders left unpaid for 24 hours (done by the API).
  async getAll(status) {
    const { data } = await api.get('/pesanan', { params: status ? { status } : {} })
    return data
  },

  async ubahStatus(id, status) {
    const { data } = await api.patch(`/pesanan/${id}/status`, { status })
    return data
  },
}

export const pengaturanService = {
  async get() {
    const { data } = await api.get('/pengaturan')
    return data
  },

  async simpan(payload) {
    const { data } = await api.put('/pengaturan', payload)
    return data
  },
}
