// Status flow from Project Plan §4.5; the API enforces the same rules.
export const STATUS = ['Menunggu Pembayaran', 'Lunas', 'Selesai', 'Dibatalkan']

export const LANGKAH_BERIKUTNYA = {
  'Menunggu Pembayaran': [
    { status: 'Lunas', label: 'Tandai Lunas', gaya: 'bg-green-600 text-white hover:bg-green-700', konfirmasi: 'Bukti transfer sudah diperiksa? Pesanan akan ditandai Lunas dan totalnya otomatis dicatat sebagai pemasukan.' },
    { status: 'Dibatalkan', label: 'Batalkan', gaya: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100', konfirmasi: 'Batalkan pesanan ini? Pesanan yang dibatalkan tidak bisa dilanjutkan lagi.' },
  ],
  Lunas: [
    { status: 'Selesai', label: 'Tandai Selesai', gaya: 'bg-indigo-600 text-white hover:bg-indigo-700', konfirmasi: 'Pesanan sudah diambil atau dikirim? Tandai sebagai Selesai.' },
  ],
  Selesai: [],
  Dibatalkan: [],
}

export const WARNA_STATUS = {
  'Menunggu Pembayaran': 'bg-amber-100 text-amber-800',
  Lunas: 'bg-green-100 text-green-700',
  Selesai: 'bg-indigo-100 text-indigo-700',
  Dibatalkan: 'bg-gray-100 text-gray-600',
}

export const formatWaktu = (value) => (value
  ? new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  : '-')

// Customer numbers are stored as 628...; wa.me takes them as they are.
export const linkWhatsApp = (nomor, nomorPesanan) => `https://wa.me/${String(nomor).replace(/\D/g, '')}?text=${encodeURIComponent(`Halo, terkait pesanan ${nomorPesanan} di Bunda Riris.`)}`
