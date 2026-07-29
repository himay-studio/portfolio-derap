import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Paperclip } from 'lucide-react';
import { PageHeader } from '@/components/shell/PageHeader';
import { Avatar, Badge, Placeholder, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { aktivitasTugas } from '@/data/activity';
import { proyekById } from '@/data/projects';
import { sprintById } from '@/data/sprints';
import { anggotaById } from '@/data/team';
import { labelById, statusById } from '@/data/taxonomy';
import { tasks, tugasById } from '@/data/tasks';
import { timesheet } from '@/data/timesheet';
import { rentangTanggal, tanggalPanjang, waktuRingkas } from '@/lib/dates';
import { bulatkanJam } from '@/lib/derived';
import { jam } from '@/lib/format';

export function generateStaticParams() {
  return tasks.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = tugasById(id);
  if (!t) return { title: 'Tugas tidak ditemukan' };
  return { title: `${t.kode} ${t.judul}`, description: t.deskripsi };
}

export default async function DetailTugas({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = tugasById(id);
  if (!t) notFound();

  const proyek = proyekById(t.proyekId);
  const sprint = sprintById(t.sprintId);
  const pj = anggotaById(t.penanggungJawabId);
  const status = statusById(t.statusId);
  const riwayat = aktivitasTugas(t.id);
  const catatan = timesheet.filter((c) => c.tugasId === t.id);
  const jamCatatan = bulatkanJam(catatan.reduce((n, c) => n + c.jam, 0));
  const subSelesai = t.subtugas.filter((s) => s.selesai).length;
  const ceklisSelesai = t.ceklis.filter((c) => c.selesai).length;

  return (
    <>
      <PageHeader
        remah={[
          { label: 'Tugas', href: '/app/tugas/' },
          ...(proyek ? [{ label: proyek.nama, href: `/app/proyek/${proyek.slug}/` }] : []),
          { label: t.kode },
        ]}
        judul={t.judul}
        keterangan={`${t.kode}, ${proyek ? `${proyek.nama}, ${proyek.klien}` : 'tanpa proyek'}`}
        aksi={
          <>
            <button type="button" className="btn btn-primary">Ubah Tugas</button>
            <button type="button" className="btn btn-secondary">Catat Jam</button>
            <button type="button" className="btn btn-secondary">Tambah Sub Tugas</button>
            <button type="button" className="btn btn-ghost">Duplikat</button>
          </>
        }
        kanan={
          <div className="row-wrap gap-2">
            {status ? <Badge tone={status.tone} pekat={status.id === 'blokir'}>{status.nama}</Badge> : null}
            <TandaPrioritas prioritas={t.prioritas} />
            <TandaTenggat iso={t.tenggat} />
          </div>
        }
      />

      <div className="grid-2">
        <div className="stack gap-4">
          <section className="card">
            <div className="card-head"><h2 className="t-h2 grow">Deskripsi</h2></div>
            <div className="card-pad">
              <p className="t-body">{t.deskripsi}</p>
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <h2 className="t-h2 grow">Sub tugas</h2>
              <span className="t-caption text-muted">{subSelesai} dari {t.subtugas.length} selesai</span>
            </div>
            <div className="card-pad">
              {t.subtugas.length === 0 ? (
                <p className="t-ui-sm text-muted">Belum ada sub tugas. Pecah pekerjaan ini kalau butuh lebih dari satu hari.</p>
              ) : (
                <>
                  <Progress
                    nilai={(subSelesai / t.subtugas.length) * 100}
                    label={`Progres sub tugas ${t.judul}`}
                  />
                  <ul className="subtugas" style={{ marginTop: 'var(--sp-3)' }}>
                    {t.subtugas.map((s) => (
                      <li key={s.id}>
                        <span className={`chip-dot`} style={{ background: s.selesai ? 'var(--success)' : 'var(--border-control)' }} aria-hidden="true" />
                        <span className={s.selesai ? 'subtugas-selesai t-ui-sm' : 't-ui-sm'}>{s.judul}</span>
                        <span className="sr-only">{s.selesai ? 'Selesai' : 'Belum selesai'}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>

          {t.ceklis.length > 0 ? (
            <section className="card">
              <div className="card-head">
                <h2 className="t-h2 grow">Ceklis</h2>
                <span className="t-caption text-muted">{ceklisSelesai} dari {t.ceklis.length}</span>
              </div>
              <div className="card-pad">
                <ul className="subtugas">
                  {t.ceklis.map((c) => (
                    <li key={c.id}>
                      <span className="chip-dot" style={{ background: c.selesai ? 'var(--success)' : 'var(--border-control)' }} aria-hidden="true" />
                      <span className={c.selesai ? 'subtugas-selesai t-ui-sm' : 't-ui-sm'}>{c.judul}</span>
                      <span className="sr-only">{c.selesai ? 'Selesai' : 'Belum selesai'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <section className="card">
            <div className="card-head">
              <h2 className="t-h2 grow">Komentar</h2>
              <span className="t-caption text-muted">{t.komentar.length}</span>
            </div>
            <div className="card-pad stack gap-4">
              {t.komentar.length === 0 ? (
                <p className="t-ui-sm text-muted">Belum ada komentar. Tulis catatan pertama untuk tim.</p>
              ) : (
                <ul className="stack gap-4">
                  {t.komentar.map((k) => {
                    const penulis = anggotaById(k.penulisId);
                    return (
                      <li key={k.id} className="row gap-3" style={{ alignItems: 'flex-start' }}>
                        {penulis ? <Avatar inisial={penulis.inisial} warna={penulis.warna} ukuran={32} nama={penulis.nama} /> : null}
                        <span className="item-text grow">
                          <span className="title">{penulis?.nama ?? 'Anonim'}</span>
                          <span className="meta">{k.waktu}</span>
                          <span className="t-body" style={{ marginTop: 'var(--sp-1)' }}>{k.isi}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Placeholder
                label="Kotak tulis komentar"
                catatan="Stage 5 menyambungkan textarea, mention anggota, dan simpan ke localStorage."
                tinggi={88}
              />
            </div>
          </section>
        </div>

        <div className="stack gap-4">
          <section className="card">
            <div className="card-head"><h2 className="t-h2 grow">Rincian</h2></div>
            <div className="card-pad">
              <dl className="def">
                <dt>Penanggung jawab</dt>
                <dd>
                  {pj ? (
                    <Link href={`/app/tim/${pj.slug}/`} className="row gap-2">
                      <Avatar inisial={pj.inisial} warna={pj.warna} ukuran={24} />
                      <span>{pj.nama}</span>
                    </Link>
                  ) : (
                    'Belum ada PJ'
                  )}
                </dd>

                <dt>Proyek</dt>
                <dd>{proyek ? <Link href={`/app/proyek/${proyek.slug}/`}>{proyek.nama}</Link> : 'Tanpa proyek'}</dd>

                <dt>Sprint</dt>
                <dd>{sprint ? <Link href={`/app/sprint/${sprint.slug}/`}>{sprint.nama}</Link> : 'Tanpa sprint'}</dd>

                <dt>Periode</dt>
                <dd>{rentangTanggal(t.mulai, t.tenggat)}</dd>

                <dt>Estimasi</dt>
                <dd className="t-mono">{jam(t.estimasiJam)}</dd>

                <dt>Tercatat</dt>
                <dd className="t-mono">{jam(jamCatatan)}</dd>

                <dt>Label</dt>
                <dd>
                  <span className="row-wrap gap-1">
                    {t.labelIds.length === 0 ? 'Tanpa label' : t.labelIds.map((id) => (
                      <span key={id} className="chip">{labelById(id)?.nama ?? id}</span>
                    ))}
                  </span>
                </dd>
              </dl>
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <h2 className="t-h2 grow">Lampiran</h2>
              <span className="t-caption text-muted">{t.lampiran.length}</span>
            </div>
            <div className="card-pad">
              {t.lampiran.length === 0 ? (
                <p className="t-ui-sm text-muted">Belum ada lampiran pada tugas ini.</p>
              ) : (
                <ul className="stack gap-2">
                  {t.lampiran.map((l) => (
                    <li key={l.id} className="row gap-2">
                      <Paperclip size={15} aria-hidden="true" className="text-muted" />
                      <span className="item-text grow">
                        <span className="title">{l.nama}</span>
                        <span className="meta">{l.jenis}, {l.ukuran}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <h2 className="t-h2 grow">Catatan jam</h2>
              <Link href="/app/timesheet/" className="t-caption">Timesheet</Link>
            </div>
            <div className="card-pad">
              {catatan.length === 0 ? (
                <p className="t-ui-sm text-muted">Belum ada jam yang dicatat untuk tugas ini.</p>
              ) : (
                <ul className="stack gap-2">
                  {catatan.map((c) => (
                    <li key={c.id} className="row gap-3">
                      <span className="item-text grow">
                        <span className="title">{anggotaById(c.anggotaId)?.nama ?? 'Anonim'}</span>
                        <span className="meta">{tanggalPanjang(c.tanggal)}, {c.catatan}</span>
                      </span>
                      <span className="t-mono t-num">{jam(c.jam)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-head"><h2 className="t-h2 grow">Riwayat aktivitas</h2></div>
            <div className="card-pad">
              {riwayat.length === 0 ? (
                <p className="t-ui-sm text-muted">Belum ada aktivitas tercatat.</p>
              ) : (
                <ul className="linimasa">
                  {riwayat.map((a) => (
                    <li key={a.id}>
                      <span className="linimasa-titik" aria-hidden="true" />
                      <span className="item-text grow">
                        <span className="title">{anggotaById(a.pelakuId)?.nama ?? 'Seseorang'} {a.ringkas}</span>
                        <span className="meta">{waktuRingkas(a.waktu)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
