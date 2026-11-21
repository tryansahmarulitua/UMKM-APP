// First validation message from a 422, otherwise the API's message, otherwise the fallback.
export function pesanError(err, fallback) {
  const errors = err.response?.data?.errors
  return errors ? Object.values(errors).flat()[0] : err.response?.data?.message || fallback
}
