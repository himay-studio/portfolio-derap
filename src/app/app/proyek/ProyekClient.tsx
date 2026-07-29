'use client';

import { Plus, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Placeholder } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import { projects } from '@/data/projects';
import { team } from '@/data/team';
import { adapterProyek } from '@/lib/adapters';
import { kesehatanProyek } from '@/lib/derived';

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

export function ProyekClient() {
  const [cari, setCari] = useState('');
  const [kesehatan, setKesehatan] = useState('semua');
  const [pemilik, setPemilik] = useState('semua');
  const [modal, setModal] = useState(false);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return projects.filter((p) => {
      if (q && !`${p.kode} ${p.nama} ${p.klien}`.toLowerCase().includes(q)) return false;
      if (kesehatan !== 'semua' && kesehatanProyek(p) !== kesehatan) return false;
      if (pemilik !== 'semua' && p.pemilikId !== pemilik) return false;
      return true;
    });
  }, [cari, kesehatan, pemilik]);

  const bermasalah = tersaring.filter((p) => kesehatanProyek(p) !== 'on_track').length;
  const adaPenyaring = cari !== '' || kesehatan !== 'semua' || pemilik !== 'semua';

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
            <button type="button" className="btn btn-secondary btn-sm" onClick={bersihkan}>Arsipkan</button>
            <span className="t-caption">{terpilih.length} dipilih</span>
          </>
        )}
      />

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Proyek"
        keterangan="Kerangka form Stage 3. Stage 5 yang menyambungkannya ke state dan localStorage."
        aksi={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setModal(false)}>Simpan Proyek</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <Placeholder
          label="Form tambah proyek"
          catatan="Field: nama, kode, klien, deskripsi, pemilik, anggota tim, tanggal mulai, tenggat, anggaran jam. Dropdown memakai Select dan tanggal memakai DatePicker."
          tinggi={200}
        />
      </Modal>
    </>
  );
}
