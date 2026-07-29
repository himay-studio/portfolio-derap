import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Burndown } from '@/components/charts/Charts';
import { KpiCard, PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Badge, EmptyState, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { proyekById } from '@/data/projects';
import { sprintBySlug, sprints } from '@/data/sprints';
import { anggotaById } from '@/data/team';
import { statusById } from '@/data/taxonomy';
import { rentangTanggal, selisihHari, HARI_INI } from '@/lib/dates';
import { burndown, bulatkanJam, progresPersen, tugasSprint } from '@/lib/derived';
import { jam } from '@/lib/format';

export function generateStaticParams() {
  return sprints.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = sprintBySlug(slug);
  if (!s) return { title: 'Sprint tidak ditemukan' };
  return { title: s.nama, description: s.sasaran };
}

const LABEL_STATUS = { berjalan: 'Berjalan', selesai: 'Selesai', akan_datang: 'Akan Datang' } as const;
const TONE_STATUS = { berjalan: 'info', selesai: 'success', akan_datang: 'neutral' } as const;

export default async function DetailSprint({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = sprintBySlug(slug);
  if (!s) notFound();

  const proyek = proyekById(s.proyekId);
  const list = tugasSprint(s.id);
  const progres = progresPersen(list);
  const bd = burndown(s);
  const selesai = list.filter((t) => statusById(t.statusId)?.selesai).length;
  const totalEstimasi = bulatkanJam(list.reduce((n, t) => n + t.estimasiJam, 0));
  const totalTercatat = bulatkanJam(list.reduce((n, t) => n + t.jamTercatat, 0));
  const sisaHari = selisihHari(HARI_INI, s.selesai);

  return (
    <>
      <PageHeader
        remah={[
          { label: 'Sprint', href: '/app/sprint/' },
          ...(proyek ? [{ label: proyek.nama, href: `/app/proyek/${proyek.slug}/` }] : []),
          { label: s.nama },
        ]}
        judul={s.nama}
        keterangan={proyek ? `${proyek.nama}, ${proyek.klien}` : 'Tanpa proyek'}
        aksi={
          <>
            <Link href="/app/tugas/" className="btn btn-primary">Tambah Tugas ke Sprint</Link>
            <button type="button" className="btn btn-secondary">Ubah Sprint</button>
            <button type="button" className="btn btn-ghost">Tutup Sprint</button>
          </>
        }
        kanan={
          <div className="row-wrap gap-2">
            <Badge tone={TONE_STATUS[s.status]}>{LABEL_STATUS[s.status]}</Badge>
            <span className="t-caption text-muted">{rentangTanggal(s.mulai, s.selesai)}</span>
          </div>
        }
      />

      <div className="kpi-row snap-row">
        <KpiCard nilai={String(list.length)} label="Tugas di sprint" keterangan={`${selesai} selesai`} />
        <KpiCard nilai={`${progres}%`} label="Progres" keterangan="Berdasarkan tugas selesai" />
        <KpiCard
          nilai={sisaHari >= 0 ? String(sisaHari) : String(Math.abs(sisaHari))}
          label={sisaHari >= 0 ? 'Hari tersisa' : 'Hari lewat'}
          keterangan={rentangTanggal(s.mulai, s.selesai)}
          tone={sisaHari < 0 ? 'danger' : sisaHari <= 3 ? 'warning' : undefined}
        />
        <KpiCard nilai={jam(totalEstimasi)} label="Total estimasi" keterangan="Seluruh tugas sprint" />
        <KpiCard nilai={jam(totalTercatat)} label="Jam tercatat" keterangan="Seluruh tugas sprint" href="/app/timesheet/" />
      </div>

      <section className="card">
        <div className="card-head">
          <h2 className="t-h2 grow">Burndown</h2>
          <span className="t-caption text-muted">{bd.total} tugas pada awal sprint</span>
        </div>
        <div className="card-pad">
          {bd.total === 0 ? (
            <EmptyState
              ragam="garis"
              judul="Belum ada tugas di sprint ini"
              penjelasan="Tambahkan tugas pertama supaya burndown punya sesuatu untuk digambar."
              aksi={<Link href="/app/tugas/" className="btn btn-primary">Tambah tugas</Link>}
            />
          ) : (
            <Burndown titik={bd.titik} total={bd.total} label={`Burndown ${s.nama}`} />
          )}
        </div>
      </section>

      <section className="card seksi">
        <div className="card-head"><h2 className="t-h2 grow">Sasaran sprint</h2></div>
        <div className="card-pad">
          <p className="t-body">{s.sasaran}</p>
          <div style={{ marginTop: 'var(--sp-4)' }}>
            <Progress nilai={progres} label={`Progres ${s.nama}`} besar />
          </div>
        </div>
      </section>

      <section className="card seksi">
        <div className="card-head">
          <h2 className="t-h2 grow">Tugas di sprint ini</h2>
          <Link href="/app/tugas/" className="t-caption">Buka papan penuh</Link>
        </div>
        {list.length === 0 ? (
          <div className="card-pad">
            <p className="t-ui-sm text-muted">Belum ada tugas di sprint ini. Tambahkan tugas pertama untuk mulai.</p>
          </div>
        ) : (
          <ul className="daftar" style={{ border: 0 }}>
            {list.map((t) => {
              const pj = anggotaById(t.penanggungJawabId);
              const st = statusById(t.statusId);
              return (
                <li key={t.id}>
                  <Link href={`/app/tugas/${t.id}/`} className="daftar-item">
                    <span className="t-mono kb-kode daftar-kode">{t.kode}</span>
                    <span className="item-text grow">
                      <span className="title">{t.judul}</span>
                      <span className="meta">{pj?.nama ?? 'Belum ada PJ'}</span>
                    </span>
                    {st ? <Badge tone={st.tone} pekat={st.id === 'blokir'}>{st.nama}</Badge> : null}
                    <TandaPrioritas prioritas={t.prioritas} />
                    <TandaTenggat iso={t.tenggat} />
                    {pj ? <Avatar inisial={pj.inisial} warna={pj.warna} ukuran={24} nama={pj.nama} /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
