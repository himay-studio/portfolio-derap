'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import { tasks } from '@/data/tasks';
import { adapterTugas, opsiAnggota, opsiStatus } from '@/lib/adapters';

/**
 * Tugas milik satu proyek, memakai lapisan view yang sama persis dengan
 * halaman Tugas. Yang berbeda hanya ruang nama localStorage-nya, supaya
 * pilihan view di dalam proyek tidak menimpa pilihan di daftar tugas global.
 */
const adapter = { ...adapterTugas, modul: 'proyek-tugas' };

export function TugasProyek({ proyekId, namaProyek }: { proyekId: string; namaProyek: string }) {
  const [cari, setCari] = useState('');
  const [status, setStatus] = useState('semua');
  const [pj, setPj] = useState('semua');

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return tasks
      .filter((t) => t.proyekId === proyekId)
      .filter((t) => (q ? `${t.kode} ${t.judul}`.toLowerCase().includes(q) : true))
      .filter((t) => (status === 'semua' ? true : t.statusId === status))
      .filter((t) => (pj === 'semua' ? true : pj === 'kosong' ? t.penanggungJawabId === null : t.penanggungJawabId === pj));
  }, [cari, proyekId, status, pj]);

  return (
    <DataViews
      judul={`Tugas ${namaProyek}`}
      keterangan="Papan, tabel, kalender, dan timeline untuk tugas proyek ini saja."
      adapter={adapter}
      baris={tersaring}
      ringkasan={`${tersaring.length} tugas`}
      aksiUtama={
        <Link href="/app/tugas/" className="btn btn-primary">
          <Plus size={15} aria-hidden="true" />
          <span>Tambah Tugas</span>
        </Link>
      }
      penyaring={
        <>
          <SearchInput nilai={cari} onUbah={setCari} label="Cari tugas proyek ini" placeholder="Cari kode atau judul" lebar={200} />
          <Select label="Status" labelTersembunyi nilai={status} opsi={opsiStatus} onUbah={setStatus} ukuran="sm" lebar={160} />
          <Select label="Penanggung jawab" labelTersembunyi nilai={pj} opsi={opsiAnggota} onUbah={setPj} ukuran="sm" lebar={190} />
        </>
      }
    />
  );
}
