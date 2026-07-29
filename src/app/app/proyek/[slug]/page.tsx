import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BarChart } from '@/components/charts/Charts';
import { KpiCard, PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Badge, Progress } from '@/components/ui/Primitives';
import { TandaTenggat } from '@/components/views/ItemCard';
import { projects, proyekBySlug } from '@/data/projects';
import { sprints } from '@/data/sprints';
import { anggotaById } from '@/data/team';
import { statusUrut } from '@/data/taxonomy';
import { WARNA_TONE } from '@/components/views/types';
import { rentangTanggal, selisihHari, tanggalPanjang, HARI_INI } from '@/lib/dates';
import {
  LABEL_KESEHATAN,
  TONE_KESEHATAN,
  bulatkanJam,
  jamTercatatProyek,
  kesehatanProyek,
  progresPersen,
  sebaranStatus,
  tugasProyek,
} from '@/lib/derived';
import { jam } from '@/lib/format';
import { TugasProyek } from './TugasProyek';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = proyekBySlug(slug);
  if (!p) return { title: 'Proyek tidak ditemukan' };
  return { title: p.nama, description: p.deskripsi };
}

export default async function DetailProyek({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = proyekBySlug(slug);
  if (!p) notFound();

  const list = tugasProyek(p.id);
  const progres = progresPersen(list);
  const kesehatan = kesehatanProyek(p);
  const pemilik = anggotaById(p.pemilikId);
  const jamTercatat = jamTercatatProyek(p.id);
  const sisaHari = selisihHari(HARI_INI, p.tenggat);
  const sprintProyek = sprints.filter((s) => s.proyekId === p.id);
  const sebaran = sebaranStatus(list);

  const bebanAnggota = p.anggotaIds
    .map((id) => anggotaById(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({
      a,
      jumlah: list.filter((t) => t.penanggungJawabId === a.id).length,
      jamAnggota: bulatkanJam(
        list.filter((t) => t.penanggungJawabId === a.id).reduce((n, t) => n + t.jamTercatat, 0),
      ),
    }))
    .sort((x, y) => y.jumlah - x.jumlah);

  return (
    <>
      <PageHeader
        remah={[{ label: 'Proyek', href: '/app/proyek/' }, { label: p.nama }]}
        judul={p.nama}
        keterangan={`${p.kode}, klien ${p.klien}`}
        aksi={
          <>
            <Link href="/app/tugas/" className="btn btn-primary">Tambah Tugas</Link>
            <button type="button" className="btn btn-secondary">Ubah Proyek</button>
            <button type="button" className="btn btn-secondary">Kelola Anggota</button>
            <button type="button" className="btn btn-ghost">Arsipkan</button>
          </>
        }
        kanan={
          <div className="row-wrap gap-2">
            <Badge tone={TONE_KESEHATAN[kesehatan]}>{LABEL_KESEHATAN[kesehatan]}</Badge>
            <TandaTenggat iso={p.tenggat} />
          </div>
        }
      />

      <div className="kpi-row snap-row">
        <KpiCard nilai={`${progres}%`} label="Progres" keterangan={`${list.filter((t) => t.statusId === 'selesai').length} dari ${list.length} tugas selesai`} />
        <KpiCard nilai={String(list.length)} label="Total tugas" keterangan="Semua status" />
        <KpiCard
          nilai={sisaHari >= 0 ? `${sisaHari}` : `${Math.abs(sisaHari)}`}
          label={sisaHari >= 0 ? 'Hari tersisa' : 'Hari telat'}
          keterangan={tanggalPanjang(p.tenggat)}
          tone={sisaHari < 0 ? 'danger' : sisaHari < 14 ? 'warning' : undefined}
        />
        <KpiCard nilai={jam(jamTercatat)} label="Jam tercatat" keterangan={`Anggaran ${jam(p.anggaranJam)}`} href="/app/timesheet/" />
        <KpiCard nilai={String(p.anggotaIds.length)} label="Anggota tim" keterangan="Terlibat di proyek ini" href="/app/tim/" />
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Rincian proyek</h2></div>
          <div className="card-pad">
            <p className="t-body" style={{ marginBottom: 'var(--sp-4)' }}>{p.deskripsi}</p>
            <dl className="def">
              <dt>Pemilik proyek</dt>
              <dd>
                {pemilik ? (
                  <Link href={`/app/tim/${pemilik.slug}/`} className="row gap-2">
                    <Avatar inisial={pemilik.inisial} warna={pemilik.warna} ukuran={24} />
                    <span>{pemilik.nama}</span>
                  </Link>
                ) : 'Belum ditetapkan'}
              </dd>
              <dt>Periode</dt>
              <dd>{rentangTanggal(p.mulai, p.tenggat)}</dd>
              <dt>Anggaran jam</dt>
              <dd className="t-mono">{jam(p.anggaranJam)}</dd>
              <dt>Jam terpakai</dt>
              <dd className="t-mono">{jam(jamTercatat)}</dd>
              <dt>Sisa anggaran</dt>
              <dd className="t-mono">{jam(p.anggaranJam - jamTercatat)}</dd>
            </dl>
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <Progress nilai={progres} label={`Progres ${p.nama}`} besar />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Sebaran status</h2></div>
          <div className="card-pad">
            <BarChart
              label={`Sebaran status tugas proyek ${p.nama}`}
              data={sebaran.map((s) => ({
                label: s.status.nama,
                nilai: s.jumlah,
                warna: WARNA_TONE[s.status.tone],
              }))}
            />
          </div>
        </section>
      </div>

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Beban per anggota di proyek ini</h2>
          <Link href="/app/tim/" className="t-caption">Halaman Tim</Link>
        </div>
        <ul className="daftar" style={{ border: 0 }}>
          {bebanAnggota.map(({ a, jumlah, jamAnggota }) => (
            <li key={a.id}>
              <Link href={`/app/tim/${a.slug}/`} className="daftar-item">
                <Avatar inisial={a.inisial} warna={a.warna} ukuran={32} />
                <span className="item-text grow">
                  <span className="title">{a.nama}</span>
                  <span className="meta">{a.peran}</span>
                </span>
                <span className="t-ui-sm text-muted">{jumlah} tugas</span>
                <span className="t-mono t-num">{jam(jamAnggota)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {sprintProyek.length > 0 ? (
        <section className="card seksi">
          <div className="card-head">
            <h2 className="t-h2 grow">Sprint di proyek ini</h2>
            <Link href="/app/sprint/" className="t-caption">Semua sprint</Link>
          </div>
          <ul className="daftar" style={{ border: 0 }}>
            {sprintProyek.map((s) => (
              <li key={s.id}>
                <Link href={`/app/sprint/${s.slug}/`} className="daftar-item">
                  <span className="item-text grow">
                    <span className="title">{s.nama}</span>
                    <span className="meta">{s.sasaran}</span>
                  </span>
                  <span className="t-ui-sm text-muted">{rentangTanggal(s.mulai, s.selesai)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="seksi">
        <TugasProyek proyekId={p.id} namaProyek={p.nama} />
      </div>

      <p className="t-caption text-muted seksi">
        Kolom status yang dipakai papan ini: {statusUrut.map((s) => s.nama).join(', ')}. Ubah di halaman Pengaturan.
      </p>
    </>
  );
}
