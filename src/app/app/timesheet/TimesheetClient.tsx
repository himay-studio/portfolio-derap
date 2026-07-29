'use client';

import Link from 'next/link';
import { Plus, RotateCcw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { BarChart } from '@/components/charts/Charts';
import { KpiCard } from '@/components/shell/PageHeader';
import { SearchInput } from '@/components/ui/Controls';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/ui/Overlay';
import { Avatar, Badge } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import type { AdapterView } from '@/components/views/types';
import { proyekById } from '@/data/projects';
import { anggotaById, penggunaSaatIni, team } from '@/data/team';
import type { CatatanJam, Tugas } from '@/data/types';
import { opsiAnggota, opsiProyek } from '@/lib/adapters';
import { HARI_INI, tanggalPanjang, tanggalPendek } from '@/lib/dates';
import { bulatkanJam } from '@/lib/derived';
import { jam } from '@/lib/format';
import { useDataStore } from '@/lib/store';

/**
 * Adapter timesheet dibangun dari daftar tugas yang sedang berlaku (dasar
 * plus tugas baru hasil demo), bukan cuma tugas dasar, supaya catatan jam
 * pada tugas yang baru dibuat tetap terhubung dengan benar (bukan terbaca
 * "tugas terhapus").
 */
function buatAdapterJam(daftarTugas: Tugas[]): AdapterView<CatatanJam> {
  const tugasById = (id: string) => daftarTugas.find((t) => t.id === id);

  return {
    modul: 'timesheet',
    labelItem: 'catatan jam',
    viewTersedia: ['tabel', 'kalender', 'daftar'],
    viewBawaan: 'tabel',
    bisaPindahGrup: false,
    kunci: (c) => c.id,
    grup: [
      { id: 'ditagihkan', nama: 'Bisa ditagihkan', tone: 'success' },
      { id: 'internal', nama: 'Internal', tone: 'neutral' },
    ],
    keItem: (c) => {
      const t = tugasById(c.tugasId);
      const p = t ? proyekById(t.proyekId) : undefined;
      const a = anggotaById(c.anggotaId);
      return {
        id: c.id,
        kode: t?.kode,
        judul: c.catatan,
        keterangan: `${a?.nama ?? 'Anonim'}, ${p?.nama ?? 'tanpa proyek'}`,
        grup: c.ditagihkan ? 'ditagihkan' : 'internal',
        mulai: c.tanggal,
        tenggat: c.tanggal,
        href: t ? `/app/tugas/${t.id}/` : '/app/timesheet/',
        orang: a ? { id: a.id, nama: a.nama, inisial: a.inisial, warna: a.warna } : null,
        metrik: [{ label: 'Jam', nilai: jam(c.jam) }],
      };
    },
    kolom: [
      {
        id: 'tanggal',
        judul: 'Tanggal',
        lebar: 130,
        wajib: true,
        nilaiUrut: (c) => c.tanggal,
        render: (c) => <span className="t-mono t-num">{tanggalPendek(c.tanggal)}</span>,
      },
      {
        id: 'anggota',
        judul: 'Anggota',
        lebar: 190,
        nilaiUrut: (c) => anggotaById(c.anggotaId)?.nama ?? '',
        render: (c) => {
          const a = anggotaById(c.anggotaId);
          if (!a) return null;
          return (
            <Link href={`/app/tim/${a.slug}/`} className="row gap-2">
              <Avatar inisial={a.inisial} warna={a.warna} ukuran={24} />
              <span className="truncate">{a.nama}</span>
            </Link>
          );
        },
      },
      {
        id: 'tugas',
        judul: 'Tugas',
        wajib: true,
        nilaiUrut: (c) => tugasById(c.tugasId)?.judul ?? '',
        render: (c) => {
          const t = tugasById(c.tugasId);
          const p = t ? proyekById(t.proyekId) : undefined;
          if (!t) return <span className="text-muted">Tugas terhapus</span>;
          return (
            <Link href={`/app/tugas/${t.id}/`} className="item-text tbl-sel-judul">
              <span className="title">{t.judul}</span>
              <span className="meta">{p?.nama ?? 'Tanpa proyek'}</span>
            </Link>
          );
        },
      },
      {
        id: 'catatan',
        judul: 'Catatan',
        bawaanTersembunyi: true,
        render: (c) => <span className="t-ui-sm text-muted">{c.catatan}</span>,
      },
      {
        id: 'tagih',
        judul: 'Penagihan',
        lebar: 140,
        nilaiUrut: (c) => (c.ditagihkan ? 0 : 1),
        render: (c) => (
          <Badge tone={c.ditagihkan ? 'success' : 'neutral'}>{c.ditagihkan ? 'Ditagihkan' : 'Internal'}</Badge>
        ),
      },
      {
        id: 'jam',
        judul: 'Jam',
        lebar: 90,
        rata: 'kanan',
        nilaiUrut: (c) => c.jam,
        render: (c) => <span className="t-mono t-num">{jam(c.jam)}</span>,
      },
    ],
  };
}

const opsiAnggotaForm = team.map((a) => ({ nilai: a.id, label: a.nama, keterangan: a.peran }));

export function TimesheetClient() {
  const store = useDataStore();
  const adapterJam = useMemo(() => buatAdapterJam(store.tasks), [store.tasks]);
  const opsiTugasForm = useMemo(
    () => store.tasks.map((t) => ({ nilai: t.id, label: t.judul, keterangan: t.kode })),
    [store.tasks],
  );

  const [cari, setCari] = useState('');
  const [anggota, setAnggota] = useState('semua');
  const [proyek, setProyek] = useState('semua');
  const [dari, setDari] = useState<string | null>(null);
  const [sampai, setSampai] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  const [formTugas, setFormTugas] = useState('');
  const [formAnggota, setFormAnggota] = useState(penggunaSaatIni.id);
  const [formTanggal, setFormTanggal] = useState<string | null>(HARI_INI);
  const [formJam, setFormJam] = useState(2);
  const [formCatatan, setFormCatatan] = useState('');
  const [formTagih, setFormTagih] = useState(true);
  const idCatatan = useId();

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return store.timesheet.filter((c) => {
      const t = store.tasks.find((x) => x.id === c.tugasId);
      if (q && !`${c.catatan} ${t?.judul ?? ''} ${t?.kode ?? ''}`.toLowerCase().includes(q)) return false;
      if (anggota !== 'semua' && anggota !== 'kosong' && c.anggotaId !== anggota) return false;
      if (proyek !== 'semua' && t?.proyekId !== proyek) return false;
      if (dari && c.tanggal < dari) return false;
      if (sampai && c.tanggal > sampai) return false;
      return true;
    });
  }, [store.timesheet, store.tasks, cari, anggota, proyek, dari, sampai]);

  const totalJam = bulatkanJam(tersaring.reduce((n, c) => n + c.jam, 0));
  const jamTagih = bulatkanJam(tersaring.filter((c) => c.ditagihkan).reduce((n, c) => n + c.jam, 0));

  const rekapOrang = useMemo(() => {
    const peta = new Map<string, number>();
    tersaring.forEach((c) => peta.set(c.anggotaId, (peta.get(c.anggotaId) ?? 0) + c.jam));
    return [...peta.entries()]
      .map(([id, n]) => ({ a: anggotaById(id), nilai: bulatkanJam(n) }))
      .filter((x): x is { a: NonNullable<ReturnType<typeof anggotaById>>; nilai: number } => Boolean(x.a))
      .sort((x, y) => y.nilai - x.nilai);
  }, [tersaring]);

  const rekapProyek = useMemo(() => {
    const peta = new Map<string, number>();
    tersaring.forEach((c) => {
      const t = store.tasks.find((x) => x.id === c.tugasId);
      if (!t) return;
      peta.set(t.proyekId, (peta.get(t.proyekId) ?? 0) + c.jam);
    });
    return [...peta.entries()]
      .map(([id, n]) => ({ p: proyekById(id), nilai: bulatkanJam(n) }))
      .filter((x): x is { p: NonNullable<ReturnType<typeof proyekById>>; nilai: number } => Boolean(x.p))
      .sort((x, y) => y.nilai - x.nilai);
  }, [tersaring, store.tasks]);

  const adaPenyaring = cari !== '' || anggota !== 'semua' || proyek !== 'semua' || dari !== null || sampai !== null;
  const valid = Boolean(formTugas) && Boolean(formTanggal) && formJam > 0;

  const simpan = () => {
    if (!valid || !formTanggal) return;
    store.tambahCatatanJam({
      tugasId: formTugas,
      anggotaId: formAnggota,
      tanggal: formTanggal,
      jam: formJam,
      catatan: formCatatan.trim() || 'Tanpa catatan.',
      ditagihkan: formTagih,
    });
    setFormTugas(''); setFormJam(2); setFormCatatan(''); setFormTagih(true);
    setModal(false);
  };

  return (
    <>
      <div className="kpi-row snap-row">
        <KpiCard nilai={jam(totalJam)} label="Total jam" keterangan={`${tersaring.length} catatan`} />
        <KpiCard nilai={jam(jamTagih)} label="Bisa ditagihkan" keterangan={`${Math.round((jamTagih / Math.max(1, totalJam)) * 100)}% dari total`} tone="success" />
        <KpiCard nilai={jam(bulatkanJam(totalJam - jamTagih))} label="Internal" keterangan="Tidak ditagihkan" />
        <KpiCard nilai={String(rekapOrang.length)} label="Anggota mencatat" keterangan={`Dari ${team.length} anggota`} />
      </div>

      <DataViews
        judul="Timesheet"
        keterangan="Jam dicatat per tugas, lalu direkap per orang dan per proyek."
        adapter={adapterJam}
        baris={tersaring}
        ringkasan={`${jam(totalJam)} tercatat`}
        aksiUtama={
          <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15} aria-hidden="true" />
            <span>Catat Jam</span>
          </button>
        }
        penyaring={
          <>
            <SearchInput nilai={cari} onUbah={setCari} label="Cari catatan jam" placeholder="Cari catatan atau tugas" lebar={220} />
            <Select label="Anggota" labelTersembunyi nilai={anggota} opsi={opsiAnggota} onUbah={setAnggota} ukuran="sm" lebar={190} />
            <Select label="Proyek" labelTersembunyi nilai={proyek} opsi={opsiProyek} onUbah={setProyek} ukuran="sm" lebar={200} />
            <DatePicker label="Dari tanggal" labelTersembunyi nilai={dari} onUbah={setDari} placeholder="Dari tanggal" ukuran="sm" lebar={180} max={sampai ?? undefined} />
            <DatePicker label="Sampai tanggal" labelTersembunyi nilai={sampai} onUbah={setSampai} placeholder="Sampai tanggal" ukuran="sm" lebar={180} min={dari ?? undefined} jangkar="kanan" />
            {adaPenyaring ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCari(''); setAnggota('semua'); setProyek('semua'); setDari(null); setSampai(null); }}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset penyaring</span>
              </button>
            ) : null}
          </>
        }
      />

      <div className="grid-2 seksi">
        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Rekap per orang</h2></div>
          <div className="card-pad">
            <BarChart
              label="Rekap jam per orang"
              satuan="j"
              data={rekapOrang.map(({ a, nilai }) => ({
                label: a.nama,
                keterangan: a.peran,
                nilai,
                warna: `var(--chart-${a.warna})`,
              }))}
            />
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2 className="t-h2 grow">Rekap per proyek</h2></div>
          <div className="card-pad">
            <BarChart
              label="Rekap jam per proyek"
              satuan="j"
              data={rekapProyek.map(({ p, nilai }, i) => ({
                label: p.nama,
                keterangan: p.klien,
                nilai,
                warna: `var(--chart-${(i % 6) + 1})`,
              }))}
            />
          </div>
        </section>
      </div>

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Catat Jam"
        keterangan={`Untuk ${tanggalPanjang(formTanggal ?? HARI_INI)}. Tersimpan di sesi demo ini.`}
        aksi={
          <>
            <button type="button" className="btn btn-primary" disabled={!valid} onClick={simpan}>Simpan Catatan</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <div className="stack gap-3">
          <Select label="Tugas" nilai={formTugas} opsi={opsiTugasForm} onUbah={setFormTugas} placeholder="Pilih tugas" />
          <div className="row-wrap gap-3">
            <Select label="Anggota" nilai={formAnggota} opsi={opsiAnggotaForm} onUbah={setFormAnggota} lebar={220} />
            <DatePicker label="Tanggal" nilai={formTanggal} onUbah={setFormTanggal} bisaDikosongkan={false} max={HARI_INI} lebar={190} />
            <Stepper label="Jumlah jam" nilai={formJam} onUbah={setFormJam} min={0.5} max={16} langkah={0.5} satuan=" j" />
          </div>
          <div className="field">
            <label htmlFor={idCatatan}>Catatan</label>
            <input id={idCatatan} className="input" value={formCatatan} onChange={(e) => setFormCatatan(e.target.value)} placeholder="Apa yang dikerjakan" />
          </div>
          <Checkbox label="Jam ini bisa ditagihkan ke klien" checked={formTagih} onChange={setFormTagih} />
          {!valid ? <p className="t-caption text-muted">Tugas, tanggal, dan jumlah jam wajib diisi.</p> : null}
        </div>
      </Modal>
    </>
  );
}
