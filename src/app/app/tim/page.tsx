import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart } from '@/components/charts/Charts';
import { KpiCard, PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Progress } from '@/components/ui/Primitives';
import { team } from '@/data/team';
import { HARI_INI, awalMinggu, tanggalPanjang } from '@/lib/dates';
import { bebanMingguan, bulatkanJam, tugasAnggota } from '@/lib/derived';
import { jam } from '@/lib/format';
import { statusById } from '@/data/taxonomy';

export const metadata: Metadata = {
  title: 'Tim',
  description: 'Daftar anggota, peran, dan beban kerja per orang dibandingkan kapasitas mingguan.',
};

const senin = awalMinggu(HARI_INI);

const TINGKAT_TONE = {
  aman: 'success',
  mendekati: 'warn',
  lebih: 'danger',
} as const;

const TINGKAT_TEKS = {
  aman: 'Di bawah kapasitas',
  mendekati: 'Mendekati kapasitas',
  lebih: 'Melebihi kapasitas',
} as const;

export default function HalamanTim() {
  const baris = team
    .map((a) => {
      const b = bebanMingguan(a.id, senin);
      const tugas = tugasAnggota(a.id);
      return {
        a,
        b,
        aktif: tugas.filter((t) => !statusById(t.statusId)?.selesai).length,
        total: tugas.length,
      };
    })
    .sort((x, y) => y.b.rasio - x.b.rasio);

  const totalJam = bulatkanJam(baris.reduce((n, x) => n + x.b.jam, 0));
  const totalKapasitas = baris.reduce((n, x) => n + x.b.kapasitas, 0);
  const kelebihan = baris.filter((x) => x.b.tingkat === 'lebih').length;
  const menganggur = baris.filter((x) => x.b.jam === 0).length;

  return (
    <>
      <PageHeader
        judul="Tim"
        keterangan={`Beban kerja minggu berjalan sejak ${tanggalPanjang(senin)}. Beban tim adalah warga kelas satu di Derap, bukan sekadar daftar nama.`}
        aksi={
          <>
            <button type="button" className="btn btn-primary">Tambah Anggota</button>
            <button type="button" className="btn btn-secondary">Atur Kapasitas</button>
            <Link href="/app/timesheet/" className="btn btn-secondary">Buka Timesheet</Link>
          </>
        }
      />

      <div className="kpi-row snap-row">
        <KpiCard nilai={String(team.length)} label="Anggota tim" keterangan="Aktif di workspace" />
        <KpiCard nilai={jam(totalJam)} label="Jam minggu ini" keterangan={`Dari kapasitas ${totalKapasitas} jam`} href="/app/timesheet/" />
        <KpiCard nilai={String(kelebihan)} label="Melebihi kapasitas" keterangan="Butuh dibagi ulang" tone={kelebihan > 0 ? 'danger' : undefined} />
        <KpiCard nilai={String(menganggur)} label="Belum mencatat jam" keterangan="Minggu ini" tone={menganggur > 0 ? 'warning' : undefined} />
      </div>

      <section className="card">
        <div className="card-head">
          <h2 className="t-h2 grow">Beban kerja per orang</h2>
          <span className="t-caption text-muted">Jam tercatat dibanding kapasitas mingguan</span>
        </div>
        <ul className="daftar" style={{ border: 0 }}>
          {baris.map(({ a, b, aktif }) => (
            <li key={a.id}>
              <Link href={`/app/tim/${a.slug}/`} className="daftar-item">
                <Avatar inisial={a.inisial} warna={a.warna} ukuran={40} />
                {/* R50. Nama dan peran dua blok terpisah dengan gap. */}
                <span className="item-text grow">
                  <span className="title">{a.nama}</span>
                  <span className="meta">{a.peran}, {a.lokasi}</span>
                </span>
                <span className="t-ui-sm text-muted">{aktif} tugas aktif</span>
                <span className="beban" style={{ flex: '0 0 200px' }}>
                  <span className="beban-bar">
                    <Progress nilai={Math.min(100, b.persen)} label={`Beban ${a.nama}`} tone={TINGKAT_TONE[b.tingkat]} />
                  </span>
                  <span className="beban-angka">{jam(b.jam)} / {b.kapasitas}j</span>
                </span>
                {/* Warna bukan satu satunya penanda, tingkat bebannya ditulis. */}
                <span className="t-caption text-muted">{TINGKAT_TEKS[b.tingkat]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="card seksi">
        <div className="card-head"><h2 className="t-h2 grow">Jam tercatat minggu ini</h2></div>
        <div className="card-pad">
          <BarChart
            label="Jam tercatat minggu ini per anggota"
            satuan="j"
            data={baris
              .filter((x) => x.b.jam > 0)
              .map(({ a, b }) => ({
                label: a.nama,
                keterangan: `${a.peran}, kapasitas ${b.kapasitas} jam`,
                nilai: b.jam,
                warna:
                  b.tingkat === 'lebih'
                    ? 'var(--danger)'
                    : b.tingkat === 'mendekati'
                      ? 'var(--chart-fill-warn)'
                      : 'var(--success)',
              }))}
          />
        </div>
      </section>
    </>
  );
}
