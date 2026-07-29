'use client';

import { Plus, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Placeholder } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import { sprints } from '@/data/sprints';
import { adapterSprint, opsiProyek } from '@/lib/adapters';

const OPSI_STATUS_SPRINT = [
  { nilai: 'semua', label: 'Semua status' },
  { nilai: 'berjalan', label: 'Berjalan' },
  { nilai: 'akan_datang', label: 'Akan Datang' },
  { nilai: 'selesai', label: 'Selesai' },
];

export function SprintClient() {
  const [cari, setCari] = useState('');
  const [status, setStatus] = useState('semua');
  const [proyek, setProyek] = useState('semua');
  const [modal, setModal] = useState(false);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return sprints.filter((s) => {
      if (q && !`${s.nama} ${s.sasaran}`.toLowerCase().includes(q)) return false;
      if (status !== 'semua' && s.status !== status) return false;
      if (proyek !== 'semua' && s.proyekId !== proyek) return false;
      return true;
    });
  }, [cari, status, proyek]);

  const adaPenyaring = cari !== '' || status !== 'semua' || proyek !== 'semua';

  return (
    <>
      <DataViews
        judul="Sprint"
        keterangan="Kelompok pekerjaan berjangka. Buka satu sprint untuk melihat burndown-nya."
        adapter={adapterSprint}
        baris={tersaring}
        ringkasan={`${tersaring.length} sprint, ${tersaring.filter((s) => s.status === 'berjalan').length} berjalan`}
        aksiUtama={
          <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15} aria-hidden="true" />
            <span>Tambah Sprint</span>
          </button>
        }
        penyaring={
          <>
            <SearchInput nilai={cari} onUbah={setCari} label="Cari sprint" placeholder="Cari nama atau sasaran" lebar={220} />
            <Select label="Status" labelTersembunyi nilai={status} opsi={OPSI_STATUS_SPRINT} onUbah={setStatus} ukuran="sm" lebar={170} />
            <Select label="Proyek" labelTersembunyi nilai={proyek} opsi={opsiProyek} onUbah={setProyek} ukuran="sm" lebar={200} />
            {adaPenyaring ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCari(''); setStatus('semua'); setProyek('semua'); }}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset penyaring</span>
              </button>
            ) : null}
          </>
        }
      />

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Sprint"
        keterangan="Kerangka form Stage 3. Stage 5 yang menyambungkannya ke state dan localStorage."
        aksi={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setModal(false)}>Simpan Sprint</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <Placeholder
          label="Form tambah sprint"
          catatan="Field: nama, proyek, sasaran, tanggal mulai, tanggal selesai. Tanggal memakai DatePicker, proyek memakai Select."
          tinggi={180}
        />
      </Modal>
    </>
  );
}
