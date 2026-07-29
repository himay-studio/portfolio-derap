'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Paperclip } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { PageHeader } from '@/components/shell/PageHeader';
import { DatePicker } from '@/components/ui/DatePicker';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Avatar, Badge, Progress } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import { TugasFormFields, tugasFormKePatch, useTugasForm } from '@/components/forms/TugasForm';
import { KomentarBox } from '@/components/tugas/KomentarBox';
import { aktivitasTugas } from '@/data/activity';
import { proyekById } from '@/data/projects';
import { sprintById } from '@/data/sprints';
import { anggotaById, penggunaSaatIni, team } from '@/data/team';
import { labelById, statusById } from '@/data/taxonomy';
import { rentangTanggal, tanggalPanjang, waktuRingkas, HARI_INI } from '@/lib/dates';
import { bulatkanJam } from '@/lib/derived';
import { jam } from '@/lib/format';
import { useDataStore } from '@/lib/store';

const opsiAnggotaCatatJam = team.map((a) => ({ nilai: a.id, label: a.nama, keterangan: a.peran }));
const opsiJenisLampiran = [
  { nilai: 'dokumen', label: 'Dokumen' },
  { nilai: 'pdf', label: 'PDF' },
  { nilai: 'gambar', label: 'Gambar' },
  { nilai: 'lembar', label: 'Lembar kerja' },
];

export function TugasDetailClient({ id }: { id: string }) {
  const store = useDataStore();
  const router = useRouter();
  const t = store.tasks.find((x) => x.id === id);

  const [modalUbah, setModalUbah] = useState(false);
  const [modalJam, setModalJam] = useState(false);
  const [modalSub, setModalSub] = useState(false);
  const [modalLampiran, setModalLampiran] = useState(false);
  const [judulSub, setJudulSub] = useState('');
  const [namaLampiran, setNamaLampiran] = useState('');
  const [jenisLampiran, setJenisLampiran] = useState<'pdf' | 'gambar' | 'dokumen' | 'lembar'>('dokumen');
  const [jamAnggota, setJamAnggota] = useState(penggunaSaatIni.id);
  const [jamTanggal, setJamTanggal] = useState<string | null>(HARI_INI);
  const [jamNilai, setJamNilai] = useState(1);
  const [jamCatatan, setJamCatatan] = useState('');
  const [jamTagih, setJamTagih] = useState(true);

  const formUbah = useTugasForm(t);
  const idJudulSub = useId();
  const idNamaLampiran = useId();
  const idCatatanJam = useId();

  // Form Ubah dibangun sekali saat komponen mount. Disinkronkan ulang setiap
  // modal dibuka supaya tidak menampilkan nilai basi kalau tugasnya berubah
  // lewat jalur lain (Kanban, aksi massal) selagi halaman ini terbuka.
  useEffect(() => {
    if (!modalUbah || !t) return;
    formUbah.setJudul(t.judul);
    formUbah.setDeskripsi(t.deskripsi);
    formUbah.setProyekId(t.proyekId);
    formUbah.setSprintId(t.sprintId ?? 'kosong');
    formUbah.setPj(t.penanggungJawabId ?? 'kosong');
    formUbah.setPrioritas(t.prioritas);
    formUbah.setMulai(t.mulai);
    formUbah.setTenggat(t.tenggat);
    formUbah.setEstimasiJam(t.estimasiJam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalUbah]);

  if (!t) {
    return (
      <div className="lg">
        <div className="lg-kartu">
          <p className="t-body">Tugas ini sudah dihapus pada sesi demo ini.</p>
          <Link href="/app/tugas/" className="btn btn-primary">Kembali ke daftar tugas</Link>
        </div>
      </div>
    );
  }

  const proyek = proyekById(t.proyekId);
  const sprint = sprintById(t.sprintId);
  const pj = anggotaById(t.penanggungJawabId);
  const status = statusById(t.statusId);
  const riwayat = aktivitasTugas(t.id);
  const catatan = store.timesheet.filter((c) => c.tugasId === t.id);
  const subSelesai = t.subtugas.filter((s) => s.selesai).length;
  const ceklisSelesai = t.ceklis.filter((c) => c.selesai).length;

  const simpanUbah = () => {
    if (!formUbah.valid) return;
    store.ubahTugas(t.id, tugasFormKePatch(formUbah));
    setModalUbah(false);
  };

  const simpanSub = () => {
    if (!judulSub.trim()) return;
    store.tambahSubtugas(t.id, judulSub);
    setJudulSub('');
    setModalSub(false);
  };

  const simpanLampiran = () => {
    if (!namaLampiran.trim()) return;
    store.tambahLampiran(t.id, namaLampiran, jenisLampiran);
    setNamaLampiran('');
    setModalLampiran(false);
  };

  const simpanJam = () => {
    if (!jamTanggal || jamNilai <= 0) return;
    store.tambahCatatanJam({
      tugasId: t.id,
      anggotaId: jamAnggota,
      tanggal: jamTanggal,
      jam: jamNilai,
      catatan: jamCatatan.trim() || 'Tanpa catatan.',
      ditagihkan: jamTagih,
    });
    setJamCatatan('');
    setJamNilai(1);
    setModalJam(false);
  };

  const duplikat = () => {
    const salinan = store.tambahTugas({
      judul: `${t.judul} (salinan)`,
      deskripsi: t.deskripsi,
      proyekId: t.proyekId,
      sprintId: t.sprintId,
      penanggungJawabId: t.penanggungJawabId,
      statusId: 'backlog',
      prioritas: t.prioritas,
      labelIds: t.labelIds,
      mulai: t.mulai,
      tenggat: t.tenggat,
      estimasiJam: t.estimasiJam,
    });
    void salinan;
    router.push('/app/tugas/');
  };

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
            <button type="button" className="btn btn-primary" onClick={() => setModalUbah(true)}>Ubah Tugas</button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalJam(true)}>Catat Jam</button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalSub(true)}>Tambah Sub Tugas</button>
            <button type="button" className="btn btn-ghost" onClick={duplikat}>Duplikat</button>
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
                  <Progress nilai={(subSelesai / t.subtugas.length) * 100} label={`Progres sub tugas ${t.judul}`} />
                  <ul className="subtugas" style={{ marginTop: 'var(--sp-3)' }}>
                    {t.subtugas.map((s) => (
                      <li key={s.id}>
                        <Checkbox
                          label={s.judul}
                          checked={s.selesai}
                          onChange={() => store.toggleSubtugas(t.id, s.id)}
                        />
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
                      <Checkbox
                        label={c.judul}
                        checked={c.selesai}
                        onChange={() => store.toggleCeklis(t.id, c.id)}
                      />
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
            <div className="card-pad">
              <KomentarBox komentar={t.komentar} onKirim={(isi) => store.tambahKomentar(t.id, isi, penggunaSaatIni.id)} />
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
                <dd className="t-mono">{jam(bulatkanJam(t.jamTercatat))}</dd>

                <dt>Label</dt>
                <dd>
                  <span className="row-wrap gap-1">
                    {t.labelIds.length === 0 ? 'Tanpa label' : t.labelIds.map((lid) => (
                      <span key={lid} className="chip">{labelById(lid)?.nama ?? lid}</span>
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
            <div className="card-pad stack gap-3">
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
              <button type="button" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setModalLampiran(true)}>
                Lampirkan berkas
              </button>
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

      <Modal terbuka={modalUbah} tutup={() => setModalUbah(false)} judul="Ubah Tugas" lebar={640}
        aksi={<>
          <button type="button" className="btn btn-primary" disabled={!formUbah.valid} onClick={simpanUbah}>Simpan Perubahan</button>
          <button type="button" className="btn btn-ghost" onClick={() => setModalUbah(false)}>Batal</button>
        </>}
      >
        <TugasFormFields form={formUbah} />
      </Modal>

      <Modal terbuka={modalSub} tutup={() => setModalSub(false)} judul="Tambah Sub Tugas"
        aksi={<>
          <button type="button" className="btn btn-primary" disabled={!judulSub.trim()} onClick={simpanSub}>Simpan</button>
          <button type="button" className="btn btn-ghost" onClick={() => setModalSub(false)}>Batal</button>
        </>}
      >
        <div className="field">
          <label htmlFor={idJudulSub}>Judul sub tugas</label>
          <input id={idJudulSub} className="input" value={judulSub} onChange={(e) => setJudulSub(e.target.value)} placeholder="Contoh, Uji ulang di perangkat Android 11" />
        </div>
      </Modal>

      <Modal terbuka={modalLampiran} tutup={() => setModalLampiran(false)} judul="Lampirkan Berkas" keterangan="Lampiran demo, tidak ada berkas nyata yang diunggah."
        aksi={<>
          <button type="button" className="btn btn-primary" disabled={!namaLampiran.trim()} onClick={simpanLampiran}>Lampirkan</button>
          <button type="button" className="btn btn-ghost" onClick={() => setModalLampiran(false)}>Batal</button>
        </>}
      >
        <div className="stack gap-3">
          <div className="field">
            <label htmlFor={idNamaLampiran}>Nama berkas</label>
            <input id={idNamaLampiran} className="input" value={namaLampiran} onChange={(e) => setNamaLampiran(e.target.value)} placeholder="Contoh, revisi-kemasan-v2.pdf" />
          </div>
          <Select label="Jenis berkas" nilai={jenisLampiran} opsi={opsiJenisLampiran} onUbah={(v) => setJenisLampiran(v as typeof jenisLampiran)} lebar={200} />
        </div>
      </Modal>

      <Modal terbuka={modalJam} tutup={() => setModalJam(false)} judul="Catat Jam" keterangan={`Untuk ${t.kode}, ${t.judul}`}
        aksi={<>
          <button type="button" className="btn btn-primary" disabled={!jamTanggal || jamNilai <= 0} onClick={simpanJam}>Simpan Catatan</button>
          <button type="button" className="btn btn-ghost" onClick={() => setModalJam(false)}>Batal</button>
        </>}
      >
        <div className="stack gap-3">
          <div className="row-wrap gap-3">
            <Select label="Anggota" nilai={jamAnggota} opsi={opsiAnggotaCatatJam} onUbah={setJamAnggota} lebar={220} />
            <DatePicker label="Tanggal" nilai={jamTanggal} onUbah={setJamTanggal} bisaDikosongkan={false} lebar={190} max={HARI_INI} />
            <Stepper label="Jumlah jam" nilai={jamNilai} onUbah={setJamNilai} min={0.5} max={16} langkah={0.5} satuan=" j" />
          </div>
          <div className="field">
            <label htmlFor={idCatatanJam}>Catatan</label>
            <input id={idCatatanJam} className="input" value={jamCatatan} onChange={(e) => setJamCatatan(e.target.value)} placeholder="Apa yang dikerjakan" />
          </div>
          <Checkbox label="Jam ini bisa ditagihkan ke klien" checked={jamTagih} onChange={setJamTagih} />
        </div>
      </Modal>
    </>
  );
}
