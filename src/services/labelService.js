import api from './api'

// Categories and flavour labels share the same simple CRUD shape: a list of { id, name } rows.
function labelService(path) {
  return {
    async getAll() {
      const { data } = await api.get(path)
      return data
    },
    async store(payload) {
      const { data } = await api.post(path, payload)
      return data
    },
    async update(id, payload) {
      const { data } = await api.put(`${path}/${id}`, payload)
      return data
    },
    async destroy(id) {
      const { data } = await api.delete(`${path}/${id}`)
      return data
    },
  }
}

export const kategoriService = labelService('/kategori')
export const rasaService = labelService('/rasa')
