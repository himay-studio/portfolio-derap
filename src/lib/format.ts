/** Format angka Bahasa Indonesia, koma untuk desimal dan titik untuk ribuan. */

export function angka(n: number): string {
  return n.toLocaleString('id-ID');
}

/** 6.5 menjadi "6,5j". Dipakai di kolom durasi yang memakai font mono. */
export function jam(n: number): string {
  const dibulatkan = Math.round(n * 10) / 10;
  return `${dibulatkan.toLocaleString('id-ID', { minimumFractionDigits: dibulatkan % 1 === 0 ? 0 : 1 })}j`;
}

export function persen(n: number): string {
  return `${Math.round(n)}%`;
}

/** Memotong teks pada batas kata, dipakai untuk pratinjau deskripsi. */
export function ringkas(teks: string, maks = 120): string {
  if (teks.length <= maks) return teks;
  const potong = teks.slice(0, maks);
  return `${potong.slice(0, potong.lastIndexOf(' '))}...`;
}

export function pluralHari(n: number): string {
  return `${n} hari`;
}
