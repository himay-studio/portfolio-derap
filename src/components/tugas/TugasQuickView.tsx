'use client';

import Link from 'next/link';
import { Drawer } from '@/components/ui/Overlay';
import { Avatar, Badge, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { proyekById } from '@/data/projects';
import { sprintById } from '@/data/sprints';
import { anggotaById, penggunaSaatIni } from '@/data/team';
import { statusById } from '@/data/taxonomy';
import { rentangTanggal } from '@/lib/dates';
import { jam } from '@/lib/format';
import { useDataStore } from '@/lib/store';
import { KomentarBox } from './KomentarBox';

/**
 * Panel geser detail tugas (R48 di LAYOUT-ARCHITECTURE.md menyebut ini
 * "sudah ada dan sudah diuji, belum dipakai"). Stage 5 memakainya sebagai
 * pratinjau cepat dari dasbor dan pencarian global, dan sebagai SATU SATUNYA
 * cara melihat detail tugas yang baru dibuat lewat demo, karena static export
 * tidak bisa mem-pre-render halaman untuk id yang lahir setelah build (R59).
 */
export function TugasQuickView({
  tugasId,
  terbuka,
  tutup,
}: {
  tugasId: string | null;
  terbuka: boolean;
  tutup: () => void;
}) {
  const store = useDataStore();
  const t = tugasId ? store.tasks.find((x) => x.id === tugasId) : undefined;

  if (!t) {
    return (
      <Drawer terbuka={terbuka} tutup={tutup} judul="Tugas tidak ditemukan">
        <p className="t-ui-sm text-muted">Tugas ini mungkin sudah dihapus pada sesi ini.</p>
      </Drawer>
    );
  }

  const proyek = proyekById(t.proyekId);
  const sprint = sprintById(t.sprintId);
  const pj = anggotaById(t.penanggungJawabId);
  const status = statusById(t.statusId);
  const baru = store.isTugasBaru(t.id);
  const subSelesai = t.subtugas.filter((s) => s.selesai).length;

  return (
    <Drawer
      terbuka={terbuka}
      tutup={tutup}
      judul={t.judul}
      keterangan={`${t.kode}${proyek ? `, ${proyek.nama}` : ''}${baru ? ', dibuat pada sesi ini' : ''}`}
      aksi={
        !baru ? (
          <Link href={`/app/tugas/${t.id}/`} className="btn btn-primary btn-sm" onClick={tutup}>
            Buka halaman penuh
          </Link>
        ) : (
          <span className="t-caption text-muted">
            Tugas demo baru hanya bisa dilihat lewat panel ini pada sesi ini.
          </span>
        )
      }
    >
      <div className="stack gap-4">
        <div className="row-wrap gap-2">
          {status ? <Badge tone={status.tone} pekat={status.id === 'blokir'}>{status.nama}</Badge> : null}
          <TandaPrioritas prioritas={t.prioritas} />
          <TandaTenggat iso={t.tenggat} />
        </div>

        <p className="t-body">{t.deskripsi}</p>

        <dl className="def">
          <dt>Penanggung jawab</dt>
          <dd>
            {pj ? (
              <span className="row gap-2">
                <Avatar inisial={pj.inisial} warna={pj.warna} ukuran={24} />
                <span>{pj.nama}</span>
              </span>
            ) : 'Belum ada PJ'}
          </dd>
          <dt>Sprint</dt>
          <dd>{sprint ? sprint.nama : 'Tanpa sprint'}</dd>
          <dt>Periode</dt>
          <dd>{rentangTanggal(t.mulai, t.tenggat)}</dd>
          <dt>Jam</dt>
          <dd className="t-mono">{jam(t.jamTercatat)} dari {jam(t.estimasiJam)}</dd>
        </dl>

        {t.subtugas.length > 0 ? (
          <div>
            <div className="row gap-2" style={{ marginBottom: 'var(--sp-2)' }}>
              <span className="t-body-strong">Sub tugas</span>
              <span className="t-caption text-muted">{subSelesai} dari {t.subtugas.length}</span>
            </div>
            <Progress nilai={(subSelesai / t.subtugas.length) * 100} label={`Progres sub tugas ${t.judul}`} />
            <ul className="subtugas" style={{ marginTop: 'var(--sp-2)' }}>
              {t.subtugas.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="cb-wrap"
                    style={{ background: 'none', border: 0, cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => store.toggleSubtugas(t.id, s.id)}
                  >
                    <span className="cb-box" aria-hidden="true">{s.selesai ? '✓' : ''}</span>
                    <span className={s.selesai ? 'subtugas-selesai t-ui-sm' : 't-ui-sm'}>{s.judul}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <span className="t-body-strong" style={{ display: 'block', marginBottom: 'var(--sp-2)' }}>
            Komentar ({t.komentar.length})
          </span>
          <KomentarBox
            komentar={t.komentar}
            onKirim={(isi) => store.tambahKomentar(t.id, isi, penggunaSaatIni.id)}
          />
        </div>
      </div>
    </Drawer>
  );
}
