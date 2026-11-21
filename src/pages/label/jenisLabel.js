import { kategoriService, rasaService } from '../../services/labelService'

// Settings for the two label pages that share DaftarLabel and LabelForm.
export const KATEGORI = {
  judul: 'Kelola Kategori',
  keterangan: 'Kelola kategori produk UMKM.',
  nama: 'Kategori',
  idKey: 'idKategori',
  namaKey: 'namaKategori',
  placeholder: 'Nama kategori produk',
  service: kategoriService,
}

export const RASA = {
  judul: 'Label Rasa',
  keterangan: 'Label rasa tampil di katalog dan dipakai chatbot untuk merekomendasikan produk sesuai selera pembeli. Menghapus label hanya melepasnya dari produk.',
  nama: 'Rasa',
  idKey: 'idRasa',
  namaKey: 'namaRasa',
  placeholder: 'Contoh: Manis, Pedas, Renyah',
  service: rasaService,
}
