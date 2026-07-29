import { activity } from '@/data/activity';
import { projects } from '@/data/projects';
import { sprints } from '@/data/sprints';
import { tasks } from '@/data/tasks';
import { team } from '@/data/team';
import { statusById, statuses } from '@/data/taxonomy';
import { timesheet } from '@/data/timesheet';
import type { Kesehatan, Proyek, Sprint, Tugas } from '@/data/types';
import { HARI_INI, selisihHari, tambahHari } from './dates';

/**
 * Semua angka turunan dihitung di sini, bukan disimpan di data.
 *
 * BRAND.md bagian 2: kesehatan proyek dihitung dari tenggat dan progres, tidak
 * pernah diisi manual. Kalau nilai ini ikut disimpan di `projects.ts`, cepat
 * atau lambat angka tersimpan dan angka terhitung akan berbeda.
 */

export const tugasProyek = (proyekId: string): Tugas[] =>
  tasks.filter((t) => t.proyekId === proyekId);

export const tugasSprint = (sprintId: string): Tugas[] =>
  tasks.filter((t) => t.sprintId === sprintId);

export const tugasAnggota = (anggotaId: string): Tugas[] =>
  tasks.filter((t) => t.penanggungJawabId === anggotaId);

export const tugasSelesai = (list: Tugas[]): Tugas[] =>
  list.filter((t) => statusById(t.statusId)?.selesai);

export function progresPersen(list: Tugas[]): number {
  if (list.length === 0) return 0;
  return Math.round((tugasSelesai(list).length / list.length) * 100);
}

/**
 * Kesehatan proyek. Membandingkan progres nyata dengan progres yang seharusnya
 * pada titik waktu ini, lalu memakai selisihnya.
 */
export function kesehatanProyek(p: Proyek, acuan: string = HARI_INI): Kesehatan {
  const list = tugasProyek(p.id);
  const progres = progresPersen(list);
  const total = selisihHari(p.mulai, p.tenggat);
  const berjalan = selisihHari(p.mulai, acuan);

  if (progres >= 100) return 'on_track';
  if (selisihHari(acuan, p.tenggat) < 0) return 'late';

  const seharusnya = total <= 0 ? 100 : Math.min(100, Math.max(0, (berjalan / total) * 100));
  const selisih = progres - seharusnya;

  if (selisih < -20) return 'late';
  if (selisih < -8) return 'at_risk';
  return 'on_track';
}

export const LABEL_KESEHATAN: Record<Kesehatan, string> = {
  on_track: 'On Track',
  at_risk: 'Berisiko',
  late: 'Telat',
};

export const TONE_KESEHATAN: Record<Kesehatan, 'success' | 'warning' | 'danger'> = {
  on_track: 'success',
  at_risk: 'warning',
  late: 'danger',
};

export function jamTercatatProyek(proyekId: string): number {
  const ids = new Set(tugasProyek(proyekId).map((t) => t.id));
  return bulatkanJam(timesheet.filter((c) => ids.has(c.tugasId)).reduce((n, c) => n + c.jam, 0));
}

export function jamTercatatAnggota(anggotaId: string, dariIso?: string, keIso?: string): number {
  return bulatkanJam(
    timesheet
      .filter((c) => c.anggotaId === anggotaId)
      .filter((c) => (dariIso ? c.tanggal >= dariIso : true))
      .filter((c) => (keIso ? c.tanggal <= keIso : true))
      .reduce((n, c) => n + c.jam, 0),
  );
}

export function bulatkanJam(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Jam pada satu minggu kerja, dipakai halaman Tim dan Timesheet. */
export function bebanMingguan(anggotaId: string, seninIso: string) {
  const akhir = tambahHari(seninIso, 6);
  const jam = jamTercatatAnggota(anggotaId, seninIso, akhir);
  const anggota = team.find((a) => a.id === anggotaId);
  const kapasitas = anggota?.kapasitasJam ?? 40;
  const rasio = kapasitas === 0 ? 0 : jam / kapasitas;
  const tingkat: 'aman' | 'mendekati' | 'lebih' =
    rasio > 1 ? 'lebih' : rasio >= 0.85 ? 'mendekati' : 'aman';
  return { jam, kapasitas, rasio, persen: Math.round(rasio * 100), tingkat };
}

/** Tugas yang jatuh tempo dalam n hari ke depan dan belum selesai. */
export function jatuhTempoDalam(n: number, acuan: string = HARI_INI): Tugas[] {
  return tasks
    .filter((t) => !statusById(t.statusId)?.selesai)
    .filter((t) => {
      const d = selisihHari(acuan, t.tenggat);
      return d >= 0 && d <= n;
    })
    .sort((a, b) => a.tenggat.localeCompare(b.tenggat));
}

export function tugasTelat(acuan: string = HARI_INI): Tugas[] {
  return tasks
    .filter((t) => !statusById(t.statusId)?.selesai)
    .filter((t) => selisihHari(acuan, t.tenggat) < 0)
    .sort((a, b) => a.tenggat.localeCompare(b.tenggat));
}

export function tugasDiblokir(): Tugas[] {
  return tasks.filter((t) => t.statusId === 'blokir');
}

/** Sebaran jumlah tugas per kolom status, dipakai dasbor dan Kanban. */
export function sebaranStatus(list: Tugas[] = tasks) {
  return statuses
    .slice()
    .sort((a, b) => a.urutan - b.urutan)
    .map((s) => ({ status: s, jumlah: list.filter((t) => t.statusId === s.id).length }));
}

/**
 * Burndown sprint sederhana. Garis ideal turun lurus dari total ke nol,
 * garis nyata memakai jumlah tugas yang belum selesai per hari.
 */
export function burndown(sprint: Sprint) {
  const list = tugasSprint(sprint.id);
  const total = list.length;
  const hari = selisihHari(sprint.mulai, sprint.selesai) + 1;
  const titik: { tanggal: string; ideal: number; sisa: number | null }[] = [];

  for (let i = 0; i < hari; i += 1) {
    const tanggal = tambahHari(sprint.mulai, i);
    const ideal = total - (total * i) / Math.max(1, hari - 1);
    const lewat = selisihHari(tanggal, HARI_INI) >= 0;
    const selesaiSampai = lewat
      ? list.filter((t) => {
          if (!statusById(t.statusId)?.selesai) return false;
          const jejak = activity.find((a) => a.tugasId === t.id && a.jenis === 'pindah_status');
          const hariSelesai = jejak ? jejak.waktu.slice(0, 10) : t.tenggat;
          return hariSelesai <= tanggal;
        }).length
      : 0;
    titik.push({
      tanggal,
      ideal: Math.round(ideal * 10) / 10,
      sisa: lewat ? total - selesaiSampai : null,
    });
  }
  return { total, titik };
}

export function ringkasanDasbor(acuan: string = HARI_INI) {
  const aktif = tasks.filter((t) => !statusById(t.statusId)?.selesai);
  return {
    totalProyek: projects.filter((p) => !p.arsip).length,
    proyekBermasalah: projects.filter((p) => kesehatanProyek(p, acuan) !== 'on_track').length,
    tugasAktif: aktif.length,
    tugasTelat: tugasTelat(acuan).length,
    jatuhTempoMingguIni: jatuhTempoDalam(7, acuan).length,
    diblokir: tugasDiblokir().length,
    sprintBerjalan: sprints.filter((s) => s.status === 'berjalan').length,
    jamMingguIni: bulatkanJam(
      timesheet
        .filter((c) => c.tanggal >= '2026-07-27' && c.tanggal <= '2026-08-02')
        .reduce((n, c) => n + c.jam, 0),
    ),
  };
}
