import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BarChart } from '@/components/charts/Charts';
import { KpiCard, PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Badge, EmptyState, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { proyekById, projects } from '@/data/projects';
import { anggotaBySlug, team } from '@/data/team';
import { statusById } from '@/data/taxonomy';
import { timesheet } from '@/data/timesheet';
import { HARI_INI, awalMinggu, tambahHari, tanggalPanjang, tanggalPendek } from '@/lib/dates';
import { bebanMingguan, bulatkanJam, tugasAnggota } from '@/lib/derived';
import { jam } from '@/lib/format';

export function generateStaticParams() {
  return team.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = anggotaBySlug(slug);
  if (!a) return { title: 'Anggota tidak ditemukan' };
  return { title: a.nama, description: `${a.peran} di Studio Derap, beban kerja dan tugas yang sedang dipegang.` };
}

const senin = awalMinggu(HARI_INI);
const TINGKAT_TONE = { aman: 'success', mendekati: 'warn', lebih: 'danger' } as const;
const TINGKAT_TEKS = {
  aman: 'Di bawah kapasitas',
  mendekati: 'Mendekati kapasitas',
  lebih: 'Melebihi kapasitas',
} as const;

export default async function DetailAnggota({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = anggotaBySlug(slug);
  if (!a) notFound();

  const b = bebanMingguan(a.id, senin);
  const tugas = tugasAnggota(a.id);
  const aktif = tugas.filter((t) => !statusById(t.statusId)?.selesai);
  const catatan = timesheet.filter((c) => c.anggotaId === a.id).sort((x, y) => y.tanggal.localeCompare(x.tanggal));
  const totalJam = bulatkanJam(catatan.reduce((n, c) => n + c.jam, 0));

  const proyekTerlibat = projects.filter((p) => p.anggotaIds.includes(a.id) || p.pemilikId === a.id);

  const perHari = Array.from({ length: 7 }, (_, i) => {
    const tgl = tambahHari(senin, i);
    return {
      label: tanggalPendek(tgl),
      nilai: bulatkanJam(catatan.filter((c) => c.tanggal === tgl).reduce((n, c) => n + c.jam, 0)),
    };
  });

  return (
    <>
      <PageHeader
        remah={[{ label: 'Tim', href: '/app/tim/' }, { label: a.nama }]}
        judul={a.nama}
        keterangan={`${a.peran}, ${a.lokasi}`}
        aksi={
          <>
            <Link href="/app/tugas/" className="btn btn-primary">Tetapkan Tugas</Link>
            <Link href="/app/timesheet/" className="btn btn-secondary">Lihat Timesheet</Link>
            <button type="button" className="btn btn-secondary">Ubah Kapasitas</button>
          </>
        }
        kanan={<Avatar inisial={a.inisial} warna={a.warna} ukuran={64} nama={a.nama} />}
      />

      <div className="kpi-row snap-row">
        <KpiCard nilai={String(aktif.length)} label="Tugas aktif" keterangan={`Dari ${tugas.length} total`} />
        <KpiCard nilai={jam(b.jam)} label="Jam minggu ini" keterangan={`Kapasitas ${b.kapasitas} jam`} tone={b.tingkat === 'lebih' ? 'danger' : b.tingkat === 'mendekati' ? 'warning' : undefined} />
        <KpiCard nilai={`${b.persen}%`} label="Beban kapasitas" keterangan={TINGKAT_TEKS[b.tingkat]} />
        <KpiCard nilai={jam(totalJam)} label="Total jam tercatat" keterangan="Dua minggu terakhir" />
        <KpiCard nilai={String(proyekTerlibat.length)} label="Proyek terlibat" keterangan="Sebagai anggota atau pemilik" href="/app/proyek/" />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Beban minggu ini</h2></div>
          <div className="card-pad">
            <Progress nilai={Math.min(100, b.persen)} label={`Beban ${a.nama}`} tone={TINGKAT_TONE[b.tingkat]} besar />
            <p className="t-ui-sm text-muted" style={{ marginTop: 'var(--sp-3)' }}>
              {jam(b.jam)} dari kapasitas {b.kapasitas} jam. {TINGKAT_TEKS[b.tingkat]}.
            </p>
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <BarChart label={`Jam per hari minggu ini untuk ${a.nama}`} satuan="j" data={perHari} />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Profil</h2></div>
          <div className="card-pad">
            <dl className="def">
              <dt>Peran</dt><dd>{a.peran}</dd>
              <dt>Email</dt><dd>{a.email}</dd>
              <dt>Lokasi</dt><dd>{a.lokasi}</dd>
              <dt>Kapasitas</dt><dd className="t-mono">{a.kapasitasJam} jam per minggu</dd>
              <dt>Bergabung</dt><dd>{tanggalPanjang(a.bergabung)}</dd>
            </dl>
          </div>
        </section>
      </div>

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Tugas yang dipegang</h2>
          <Link href="/app/tugas/" className="t-caption">Papan penuh</Link>
        </div>
        {aktif.length === 0 ? (
          <div className="card-pad">
            <EmptyState
              ragam="kotak"
              judul="Tidak ada tugas aktif"
              penjelasan={`${a.nama} tidak sedang memegang tugas yang belum selesai. Tetapkan tugas baru kalau kapasitasnya masih longgar.`}
              aksi={<Link href="/app/tugas/" className="btn btn-primary">Tetapkan tugas</Link>}
            />
          </div>
        ) : (
          <ul className="daftar" style={{ border: 0 }}>
            {aktif.map((t) => {
              const st = statusById(t.statusId);
              const p = proyekById(t.proyekId);
              return (
                <li key={t.id}>
                  <Link href={`/app/tugas/${t.id}/`} className="daftar-item">
                    <span className="t-mono kb-kode daftar-kode">{t.kode}</span>
                    <span className="item-text grow">
                      <span className="title">{t.judul}</span>
                      <span className="meta">{p?.nama ?? 'Tanpa proyek'}</span>
                    </span>
                    {st ? <Badge tone={st.tone} pekat={st.id === 'blokir'}>{st.nama}</Badge> : null}
                    <TandaPrioritas prioritas={t.prioritas} />
                    <TandaTenggat iso={t.tenggat} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Catatan jam terbaru</h2>
          <Link href="/app/timesheet/" className="t-caption">Timesheet penuh</Link>
        </div>
        {catatan.length === 0 ? (
          <div className="card-pad">
            <p className="t-ui-sm text-muted">Belum ada jam yang dicatat.</p>
          </div>
        ) : (
          <ul className="daftar" style={{ border: 0 }}>
            {catatan.slice(0, 10).map((c) => (
              <li key={c.id}>
                <span className="daftar-item">
                  <span className="item-text grow">
                    <span className="title">{c.catatan}</span>
                    <span className="meta">{tanggalPanjang(c.tanggal)}</span>
                  </span>
                  <span className="t-mono t-num">{jam(c.jam)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
