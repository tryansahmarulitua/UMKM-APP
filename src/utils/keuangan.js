export const totalJenis = (items, jenis) => items
  .filter((item) => item.jenis === jenis)
  .reduce((total, item) => total + Number(item.jumlah), 0)

export const saldo = (items) => totalJenis(items, 'Pemasukan') - totalJenis(items, 'Pengeluaran')
