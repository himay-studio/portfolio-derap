/**
 * Semua tanggal diperlakukan sebagai string ISO `YYYY-MM-DD` tanpa zona waktu.
 *
 * Static export mengharuskan markup server dan klien identik, jadi TIDAK BOLEH
 * ada `new Date()` tanpa argumen di jalur render. Hari acuan aplikasi demo
 * dikunci di `HARI_INI`.
 */

export const HARI_INI = '2026-07-29';

export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const NAMA_BULAN_PENDEK = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

/** Minggu dimulai Senin (pengaturan workspace). */
export const NAMA_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
export const NAMA_HARI_PENDEK = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export interface Ymd { y: number; m: number; d: number }

export function parseIso(iso: string): Ymd {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

export function toIso({ y, m, d }: Ymd): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Hari sejak epoch, dihitung tanpa zona waktu supaya stabil di server dan klien. */
export function hariSejakEpoch(iso: string): number {
  const { y, m, d } = parseIso(iso);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function selisihHari(dariIso: string, keIso: string): number {
  return hariSejakEpoch(keIso) - hariSejakEpoch(dariIso);
}

export function tambahHari(iso: string, n: number): string {
  const { y, m, d } = parseIso(iso);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`;
}

/** 0 = Senin, 6 = Minggu. */
export function indeksHari(iso: string): number {
  const { y, m, d } = parseIso(iso);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

export function jumlahHariBulan(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Senin pada minggu yang memuat tanggal ini. */
export function awalMinggu(iso: string): string {
  return tambahHari(iso, -indeksHari(iso));
}

/* -------------------------------------------------------------------------- */
/* Format tampilan                                                            */
/* -------------------------------------------------------------------------- */

/** 29 Juli 2026 */
export function tanggalPanjang(iso: string): string {
  const { y, m, d } = parseIso(iso);
  return `${d} ${NAMA_BULAN[m - 1]} ${y}`;
}

/** 29 Jul 2026 */
export function tanggalPendek(iso: string): string {
  const { y, m, d } = parseIso(iso);
  return `${d} ${NAMA_BULAN_PENDEK[m - 1]} ${y}`;
}

/** 29 Jul */
export function tanggalRingkas(iso: string): string {
  const { m, d } = parseIso(iso);
  return `${d} ${NAMA_BULAN_PENDEK[m - 1]}`;
}

/** Rentang tanggal, ditulis dengan kata "sampai" karena en dash dilarang (R11). */
export function rentangTanggal(dariIso: string, keIso: string): string {
  const a = parseIso(dariIso);
  const b = parseIso(keIso);
  if (a.y === b.y && a.m === b.m) return `${a.d} sampai ${b.d} ${NAMA_BULAN_PENDEK[b.m - 1]} ${b.y}`;
  if (a.y === b.y) return `${tanggalRingkas(dariIso)} sampai ${tanggalRingkas(keIso)} ${b.y}`;
  return `${tanggalPendek(dariIso)} sampai ${tanggalPendek(keIso)}`;
}

/**
 * Bahasa relatif tenggat. Nada bicara Derap memakai angka, bukan kata sifat:
 * "Telat 3 hari", bukan "Sedikit terlambat" (BRAND.md bagian 6).
 */
export function relatifTenggat(iso: string, acuan: string = HARI_INI): string {
  const n = selisihHari(acuan, iso);
  if (n === 0) return 'Jatuh tempo hari ini';
  if (n === 1) return 'Jatuh tempo besok';
  if (n === -1) return 'Telat 1 hari';
  if (n < 0) return `Telat ${Math.abs(n)} hari`;
  if (n <= 7) return `${n} hari lagi`;
  return tanggalPendek(iso);
}

export function terlambat(iso: string, acuan: string = HARI_INI): boolean {
  return selisihHari(acuan, iso) < 0;
}

/** Waktu aktivitas disimpan sebagai "YYYY-MM-DD HH:MM". */
export function waktuRingkas(stamp: string): string {
  const [tgl, jam] = stamp.split(' ');
  return `${tanggalRingkas(tgl)}, ${jam ?? ''}`.trim();
}
