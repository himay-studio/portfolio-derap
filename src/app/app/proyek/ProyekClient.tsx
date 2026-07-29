'use client';

import { Plus, RotateCcw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { DatePicker } from '@/components/ui/DatePicker';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import { team } from '@/data/team';
import { adapterProyek } from '@/lib/adapters';
import { HARI_INI, tambahHari } from '@/lib/dates';
import { kesehatanProyek } from '@/lib/derived';
import { useDataStore } from '@/lib/store';

const OPSI_KESEHATAN = [
  { nilai: 'semua', label: 'Semua kesehatan' },
  { nilai: 'on_track', label: 'On Track' },
  { nilai: 'at_risk', label: 'Berisiko' },
  { nilai: 'late', label: 'Telat' },
];

const OPSI_PEMILIK = [
  { nilai: 'semua', label: 'Semua pemilik' },
  ...team.map((a) => ({ nilai: a.id, label: a.nama, keterangan: a.peran })),
];

const OPSI_PEMILIK_FORM = team.map((a) => ({ nilai: a.id, label: a.nama, keterangan: a.peran }));

const slugkan = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'proyek-baru';

export function ProyekClient() {
  const store = useDataStore();
  const [cari, setCari] = useState('');
  const [kesehatan, setKesehatan] = useState('semua');
  const [pemilik, setPemilik] = useState('semua');
  const [modal, setModal] = useState(false);

  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');
  const [klien, setKlien] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pemilikBaru, setPemilikBaru] = useState(team[0].id);
  const [anggota, setAnggota] = useState<string[]>([team[0].id]);
  const [mulai, setMulai] = useState<string | null>(HARI_INI);
  const [tenggat, setTenggat] = useState<string | null>(tambahHari(HARI_INI, 60));
  const [anggaranJam, setAnggaranJam] = useState(200);

  const idNama = useId();
  const idKode = useId();
  const idKlien = useId();
  const idDeskripsi = useId();

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return store.projects.filter((p) => {
      if (p.arsip) return false;
      if (q && !`${p.kode} ${p.nama} ${p.klien}`.toLowerCase().includes(q)) return false;
      if (kesehatan !== 'semua' && kesehatanProyek(p) !== kesehatan) return false;
      if (pemilik !== 'semua' && p.pemilikId !== pemilik) return false;
      return true;
    });
  }, [store.projects, cari, kesehatan, pemilik]);

  const bermasalah = tersaring.filter((p) => kesehatanProyek(p) !== 'on_track').length;
  const adaPenyaring = cari !== '' || kesehatan !== 'semua' || pemilik !== 'semua';
  const valid = nama.trim().length > 2 && klien.trim().length > 1 && Boolean(mulai) && Boolean(tenggat);

  const toggleAnggota = (id: string) =>
    setAnggota((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const simpan = () => {
    if (!valid) return;
    store.tambahProyek({
      slug: slugkan(nama),
      kode: kode.trim() || nama.slice(0, 3).toUpperCase(),
      nama: nama.trim(),
      klien: klien.trim(),
      deskripsi: deskripsi.trim() || 'Belum ada deskripsi.',
      mulai: mulai ?? HARI_INI,
      tenggat: tenggat ?? HARI_INI,
      pemilikId: pemilikBaru,
      anggotaIds: anggota.length > 0 ? anggota : [pemilikBaru],
      anggaranJam,
    });
    setNama(''); setKode(''); setKlien(''); setDeskripsi(''); setAnggota([team[0].id]);
    setMulai(HARI_INI); setTenggat(tambahHari(HARI_INI, 60)); setAnggaranJam(200);
    setModal(false);
  };

  return (
    <>
      <DataViews
        judul="Proyek"
        keterangan="Kesehatan proyek dihitung dari tenggat dan progres, bukan diisi manual."
        adapter={adapterProyek}
        baris={tersaring}
        ringkasan={`${tersaring.length} proyek, ${bermasalah} tidak on track`}
        aksiUtama={
          <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15} aria-hidden="true" />
            <span>Tambah Proyek</span>
          </button>
        }
        penyaring={
          <>
            <SearchInput nilai={cari} onUbah={setCari} label="Cari proyek" placeholder="Cari nama atau klien" lebar={220} />
            <Select label="Kesehatan" labelTersembunyi nilai={kesehatan} opsi={OPSI_KESEHATAN} onUbah={setKesehatan} ukuran="sm" lebar={180} />
            <Select label="Pemilik" labelTersembunyi nilai={pemilik} opsi={OPSI_PEMILIK} onUbah={setPemilik} ukuran="sm" lebar={190} />
            {adaPenyaring ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCari(''); setKesehatan('semua'); setPemilik('semua'); }}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset penyaring</span>
              </button>
            ) : null}
          </>
        }
        aksiMassal={(terpilih, bersihkan) => (
          <>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { store.arsipkanProyek(terpilih.map((p) => p.id)); bersihkan(); }}
            >
              Arsipkan
            </button>
            <span className="t-caption">{terpilih.length} dipilih</span>
          </>
        )}
      />

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Proyek"
        keterangan="Tersimpan di sesi demo ini."
        lebar={640}
        aksi={
          <>
            <button type="button" className="btn btn-primary" disabled={!valid} onClick={simpan}>Simpan Proyek</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <div className="stack gap-4">
          <div className="row-wrap gap-3">
            <div className="field" style={{ flex: '1 1 220px' }}>
              <label htmlFor={idNama}>Nama proyek</label>
              <input id={idNama} className="input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh, Peluncuran Aplikasi Loyalti" />
            </div>
            <div className="field" style={{ flex: '0 0 120px' }}>
              <label htmlFor={idKode}>Kode</label>
              <input id={idKode} className="input" value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="LYL" maxLength={5} />
            </div>
          </div>
          <div className="field">
            <label htmlFor={idKlien}>Klien</label>
            <input id={idKlien} className="input" value={klien} onChange={(e) => setKlien(e.target.value)} placeholder="Nama perusahaan klien" />
          </div>
          <div className="field">
            <label htmlFor={idDeskripsi}>Deskripsi</label>
            <textarea id={idDeskripsi} className="textarea" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Ringkas lingkup dan tujuan proyek." />
          </div>
          <div className="row-wrap gap-3">
            <Select label="Pemilik" nilai={pemilikBaru} opsi={OPSI_PEMILIK_FORM} onUbah={setPemilikBaru} lebar={220} />
            <DatePicker label="Mulai" nilai={mulai} onUbah={setMulai} bisaDikosongkan={false} max={tenggat ?? undefined} lebar={190} />
            <DatePicker label="Tenggat" nilai={tenggat} onUbah={setTenggat} bisaDikosongkan={false} min={mulai ?? undefined} lebar={190} />
            <Stepper label="Anggaran jam" nilai={anggaranJam} onUbah={setAnggaranJam} min={10} max={5000} langkah={10} satuan=" j" />
          </div>
          <div className="field">
            <span className="sel-label" style={{ display: 'block' }}>Anggota tim</span>
            <div className="row-wrap gap-3" role="group" aria-label="Pilih anggota proyek">
              {team.map((a) => (
                <Checkbox key={a.id} label={a.nama} checked={anggota.includes(a.id)} onChange={() => toggleAnggota(a.id)} />
              ))}
            </div>
          </div>
          {!valid ? <p className="t-caption text-muted">Nama, klien, tanggal mulai, dan tenggat wajib diisi.</p> : null}
        </div>
      </Modal>
    </>
  );
}
