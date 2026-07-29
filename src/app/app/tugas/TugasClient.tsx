'use client';

import { Plus, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/ui/Overlay';
import { Placeholder } from '@/components/ui/Primitives';
import { SearchInput } from '@/components/ui/Controls';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import { tasks } from '@/data/tasks';
import { statusById } from '@/data/taxonomy';
import {
  adapterTugas,
  opsiAnggota,
  opsiPrioritas,
  opsiProyek,
  opsiSprint,
  opsiStatus,
} from '@/lib/adapters';
import { selisihHari } from '@/lib/dates';
import { HARI_INI } from '@/lib/dates';

/**
 * Halaman Tugas.
 *
 * Penyaring tinggal DI SINI, bukan di dalam lapisan view, jadi berpindah antara
 * Kanban, Tabel, Kalender, dan Timeline tidak pernah mereset penyaring yang
 * sedang aktif, dan keempat view selalu memandang himpunan yang sama persis.
 */
export function TugasClient() {
  const [cari, setCari] = useState('');
  const [proyek, setProyek] = useState('semua');
  const [status, setStatus] = useState('semua');
  const [prioritas, setPrioritas] = useState('semua');
  const [pj, setPj] = useState('semua');
  const [sprint, setSprint] = useState('semua');
  const [sebelum, setSebelum] = useState<string | null>(null);
  const [modalTambah, setModalTambah] = useState(false);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q && !`${t.kode} ${t.judul} ${t.deskripsi}`.toLowerCase().includes(q)) return false;
      if (proyek !== 'semua' && t.proyekId !== proyek) return false;
      if (status !== 'semua' && t.statusId !== status) return false;
      if (prioritas !== 'semua' && t.prioritas !== prioritas) return false;
      if (pj === 'kosong' ? t.penanggungJawabId !== null : pj !== 'semua' && t.penanggungJawabId !== pj) return false;
      if (sprint === 'kosong' ? t.sprintId !== null : sprint !== 'semua' && t.sprintId !== sprint) return false;
      if (sebelum && t.tenggat > sebelum) return false;
      return true;
    });
  }, [cari, proyek, status, prioritas, pj, sprint, sebelum]);

  const adaPenyaring =
    cari !== '' || proyek !== 'semua' || status !== 'semua' || prioritas !== 'semua' ||
    pj !== 'semua' || sprint !== 'semua' || sebelum !== null;

  const reset = () => {
    setCari(''); setProyek('semua'); setStatus('semua'); setPrioritas('semua');
    setPj('semua'); setSprint('semua'); setSebelum(null);
  };

  const jumlahTelat = tersaring.filter(
    (t) => !statusById(t.statusId)?.selesai && selisihHari(HARI_INI, t.tenggat) < 0,
  ).length;

  return (
    <>
      <DataViews
        judul="Tugas"
        keterangan="Satu sumber data, empat cara memandang. Pilihan view terakhir kamu diingat."
        adapter={adapterTugas}
        baris={tersaring}
        ringkasan={`${tersaring.length} dari ${tasks.length} tugas, ${jumlahTelat} telat`}
        aksiUtama={
          // Aksi utama ada di KIRI, sejajar dengan awal isi, konsisten di
          // seluruh aplikasi. Bukan di pojok kanan atas.
          <button type="button" className="btn btn-primary" onClick={() => setModalTambah(true)}>
            <Plus size={15} aria-hidden="true" />
            <span>Tambah Tugas</span>
          </button>
        }
        penyaring={
          <>
            <SearchInput nilai={cari} onUbah={setCari} label="Cari tugas" placeholder="Cari kode atau judul" lebar={220} />
            <Select label="Proyek" labelTersembunyi nilai={proyek} opsi={opsiProyek} onUbah={setProyek} ukuran="sm" lebar={190} />
            <Select label="Status" labelTersembunyi nilai={status} opsi={opsiStatus} onUbah={setStatus} ukuran="sm" lebar={160} />
            <Select label="Prioritas" labelTersembunyi nilai={prioritas} opsi={opsiPrioritas} onUbah={setPrioritas} ukuran="sm" lebar={150} />
            <Select label="Penanggung jawab" labelTersembunyi nilai={pj} opsi={opsiAnggota} onUbah={setPj} ukuran="sm" lebar={190} />
            <Select label="Sprint" labelTersembunyi nilai={sprint} opsi={opsiSprint} onUbah={setSprint} ukuran="sm" lebar={170} />
            <DatePicker label="Tenggat sampai" labelTersembunyi nilai={sebelum} onUbah={setSebelum} placeholder="Tenggat sampai" ukuran="sm" lebar={190} />
            {adaPenyaring ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset penyaring</span>
              </button>
            ) : null}
          </>
        }
        aksiMassal={(terpilih, bersihkan) => (
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={bersihkan}>
              Pindahkan status
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={bersihkan}>
              Tetapkan penanggung jawab
            </button>
            <span className="t-caption">{terpilih.length} dipilih</span>
          </>
        )}
      />

      <Modal
        terbuka={modalTambah}
        tutup={() => setModalTambah(false)}
        judul="Tambah Tugas"
        keterangan="Kerangka form Stage 3. Stage 5 yang menyambungkannya ke state dan localStorage."
        aksi={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setModalTambah(false)}>Simpan Tugas</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModalTambah(false)}>Batal</button>
          </>
        }
      >
        <Placeholder
          label="Form tambah tugas"
          catatan="Field: judul, deskripsi, proyek, sprint, penanggung jawab, prioritas, label, tanggal mulai, tenggat, estimasi jam. Dropdown memakai Select dan tanggal memakai DatePicker, keduanya sudah tersedia sebagai komponen dasar."
          tinggi={200}
        />
      </Modal>
    </>
  );
}
