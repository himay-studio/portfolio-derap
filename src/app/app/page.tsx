import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart } from '@/components/charts/Charts';
import { KpiCard, PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Badge, EmptyState, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { activity } from '@/data/activity';
import { projects } from '@/data/projects';
import { sprints } from '@/data/sprints';
import { anggotaById, penggunaSaatIni, team } from '@/data/team';
import { statusById } from '@/data/taxonomy';
import { HARI_INI, awalMinggu, tanggalPanjang, waktuRingkas } from '@/lib/dates';
import {
  LABEL_KESEHATAN,
  TONE_KESEHATAN,
  bebanMingguan,
  jatuhTempoDalam,
  kesehatanProyek,
  progresPersen,
  ringkasanDasbor,
  tugasAnggota,
  tugasDiblokir,
  tugasProyek,
  tugasTelat,
} from '@/lib/derived';
import { jam } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Ringkasan tugas jatuh tempo, tugas telat, beban tim, dan progres proyek.',
};

const senin = awalMinggu(HARI_INI);

export default function Dashboard() {
  const r = ringkasanDasbor();
  const telat = tugasTelat().slice(0, 6);
  const segera = jatuhTempoDalam(7).slice(0, 6);
  const diblokir = tugasDiblokir();
  const milikSaya = tugasAnggota(penggunaSaatIni.id).filter((t) => !statusById(t.statusId)?.selesai);

  const beban = team
    .map((a) => ({ a, b: bebanMingguan(a.id, senin) }))
    .filter((x) => x.b.jam > 0)
    .sort((x, y) => y.b.rasio - x.b.rasio)
    .slice(0, 8);

  return (
    <>
      <PageHeader
        judul={`Selamat datang, ${penggunaSaatIni.nama.split(' ')[0]}`}
        keterangan={`Ringkasan per ${tanggalPanjang(HARI_INI)}. Minggu kerja berjalan sejak ${tanggalPanjang(senin)}.`}
        aksi={
          <>
            <Link href="/app/tugas/" className="btn btn-primary">Tambah Tugas</Link>
            <Link href="/app/proyek/" className="btn btn-secondary">Tambah Proyek</Link>
            <Link href="/app/timesheet/" className="btn btn-secondary">Catat Jam</Link>
          </>
        }
      />

      {/* Delapan ubin, lebih dari 3 item peer, jadi jadi carousel snap di
          mobile (R48). Di layar lebar tetap kisi. */}
      <div className="kpi-row snap-row">
        <KpiCard nilai={String(r.tugasAktif)} label="Tugas aktif" keterangan="Belum selesai" href="/app/tugas/" />
        <KpiCard nilai={String(r.tugasTelat)} label="Tugas telat" keterangan="Lewat tenggat" tone="danger" href="/app/tugas/" />
        <KpiCard nilai={String(r.jatuhTempoMingguIni)} label="Jatuh tempo 7 hari" keterangan="Termasuk hari ini" tone="warning" href="/app/tugas/" />
        <KpiCard nilai={String(r.diblokir)} label="Diblokir" keterangan="Butuh keputusan" tone="danger" href="/app/tugas/" />
        <KpiCard nilai={String(r.totalProyek)} label="Proyek berjalan" keterangan={`${r.proyekBermasalah} tidak on track`} href="/app/proyek/" />
        <KpiCard nilai={String(r.sprintBerjalan)} label="Sprint berjalan" keterangan="Sedang aktif" tone="info" href="/app/sprint/" />
        <KpiCard nilai={jam(r.jamMingguIni)} label="Jam minggu ini" keterangan="Seluruh tim" href="/app/timesheet/" />
        <KpiCard nilai={String(milikSaya.length)} label="Tugas saya" keterangan="Belum selesai" href={`/app/tim/${penggunaSaatIni.slug}/`} />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head">
            <h2 className="t-h2 grow">Telat</h2>
            <Link href="/app/tugas/" className="t-caption">Lihat semua</Link>
          </div>
          {telat.length === 0 ? (
            <div className="card-pad">
              <p className="t-ui-sm text-muted">Tidak ada tugas yang lewat tenggat. Pertahankan.</p>
            </div>
          ) : (
            <ul className="daftar" style={{ border: 0 }}>
              {telat.map((t) => (
                <li key={t.id}>
                  <Link href={`/app/tugas/${t.id}/`} className="daftar-item">
                    <span className="t-mono kb-kode daftar-kode">{t.kode}</span>
                    <span className="item-text grow">
                      <span className="title">{t.judul}</span>
                      <span className="meta">{anggotaById(t.penanggungJawabId)?.nama ?? 'Belum ada PJ'}</span>
                    </span>
                    <TandaPrioritas prioritas={t.prioritas} />
                    <TandaTenggat iso={t.tenggat} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2 className="t-h2 grow">Jatuh tempo 7 hari ke depan</h2>
            <Link href="/app/tugas/" className="t-caption">Lihat semua</Link>
          </div>
          {segera.length === 0 ? (
            <div className="card-pad">
              <EmptyState
                ragam="kalender"
                judul="Belum ada tenggat minggu ini"
                penjelasan="Tetapkan tenggat pada tugas yang sedang berjalan supaya tidak ada kejutan."
                aksi={<Link href="/app/tugas/" className="btn btn-primary">Buka daftar tugas</Link>}
              />
            </div>
          ) : (
            <ul className="daftar" style={{ border: 0 }}>
              {segera.map((t) => (
                <li key={t.id}>
                  <Link href={`/app/tugas/${t.id}/`} className="daftar-item">
                    <span className="t-mono kb-kode daftar-kode">{t.kode}</span>
                    <span className="item-text grow">
                      <span className="title">{t.judul}</span>
                      <span className="meta">{anggotaById(t.penanggungJawabId)?.nama ?? 'Belum ada PJ'}</span>
                    </span>
                    <TandaTenggat iso={t.tenggat} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Beban tim minggu ini</h2>
          <Link href="/app/tim/" className="t-caption">Halaman Tim</Link>
        </div>
        <div className="card-pad">
          <BarChart
            label="Jam tercatat minggu ini per anggota"
            satuan="j"
            data={beban.map(({ a, b }) => ({
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
          <p className="t-caption text-muted" style={{ marginTop: 'var(--sp-3)' }}>
            Hijau di bawah kapasitas, kuning mendekati kapasitas, merah melebihi kapasitas. Angka jam ditulis di ujung setiap batang, jadi warna bukan satu satunya penanda.
          </p>
        </div>
      </section>

      <div className="grid-2 seksi">
        <section className="card">
          <div className="card-head">
            <h2 className="t-h2 grow">Progres proyek</h2>
            <Link href="/app/proyek/" className="t-caption">Semua proyek</Link>
          </div>
          <ul className="daftar" style={{ border: 0 }}>
            {projects.map((p) => {
              const list = tugasProyek(p.id);
              const n = progresPersen(list);
              const k = kesehatanProyek(p);
              return (
                <li key={p.id}>
                  <Link href={`/app/proyek/${p.slug}/`} className="daftar-item">
                    <span className="item-text grow">
                      <span className="title">{p.nama}</span>
                      <span className="meta">{p.klien}, {list.length} tugas</span>
                    </span>
                    <span className="beban" style={{ flex: '0 0 160px' }}>
                      <span className="beban-bar"><Progress nilai={n} label={`Progres ${p.nama}`} /></span>
                      <span className="beban-angka">{n}%</span>
                    </span>
                    <Badge tone={TONE_KESEHATAN[k]}>{LABEL_KESEHATAN[k]}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card">
          <div className="card-head">
            <h2 className="t-h2 grow">Aktivitas terbaru</h2>
          </div>
          <div className="card-pad">
            <ul className="linimasa">
              {activity.slice(0, 10).map((a) => {
                const pelaku = anggotaById(a.pelakuId);
                return (
                  <li key={a.id}>
                    <span className="linimasa-titik" aria-hidden="true" />
                    <span className="item-text grow">
                      <span className="title">
                        {pelaku?.nama ?? 'Seseorang'} {a.ringkas}
                      </span>
                      <span className="meta">{waktuRingkas(a.waktu)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      {diblokir.length > 0 ? (
        <section className="card seksi">
          <div className="card-head">
            <h2 className="t-h2 grow">Diblokir, butuh keputusan</h2>
          </div>
          <ul className="daftar" style={{ border: 0 }}>
            {diblokir.map((t) => {
              const a = anggotaById(t.penanggungJawabId);
              return (
                <li key={t.id}>
                  <Link href={`/app/tugas/${t.id}/`} className="daftar-item">
                    <span className="t-mono kb-kode daftar-kode">{t.kode}</span>
                    <span className="item-text grow">
                      <span className="title">{t.judul}</span>
                      <span className="meta">{t.komentar[t.komentar.length - 1]?.isi ?? 'Belum ada catatan penghambat.'}</span>
                    </span>
                    {a ? <Avatar inisial={a.inisial} warna={a.warna} ukuran={24} nama={a.nama} /> : null}
                    <TandaTenggat iso={t.tenggat} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Sprint berjalan</h2>
          <Link href="/app/sprint/" className="t-caption">Semua sprint</Link>
        </div>
        <ul className="daftar" style={{ border: 0 }}>
          {sprints
            .filter((s) => s.status === 'berjalan')
            .map((s) => (
              <li key={s.id}>
                <Link href={`/app/sprint/${s.slug}/`} className="daftar-item">
                  <span className="item-text grow">
                    <span className="title">{s.nama}</span>
                    <span className="meta">{s.sasaran}</span>
                  </span>
                  <TandaTenggat iso={s.selesai} />
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
