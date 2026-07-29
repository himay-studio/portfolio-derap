'use client';

import { useState } from 'react';
import { Checkbox, SegmentedControl, Stepper, Toggle } from '@/components/ui/Controls';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select } from '@/components/ui/Select';
import { workspace } from '@/data/taxonomy';

const OPSI_ZONA = [
  { nilai: 'wib', label: 'WIB, GMT+7', keterangan: 'Jakarta, Bandung, Medan' },
  { nilai: 'wita', label: 'WITA, GMT+8', keterangan: 'Denpasar, Makassar, Balikpapan' },
  { nilai: 'wit', label: 'WIT, GMT+9', keterangan: 'Jayapura, Ambon' },
];

const OPSI_AWAL_MINGGU = [
  { nilai: 'senin', label: 'Senin' },
  { nilai: 'minggu', label: 'Minggu' },
];

const OPSI_BAHASA = [
  { nilai: 'id', label: 'Bahasa Indonesia' },
  { nilai: 'en', label: 'English', nonaktif: true },
];

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

/**
 * Kerangka form pengaturan Stage 3.
 *
 * Semua kontrol di sini adalah komponen dasar yang dipakai ulang di seluruh
 * aplikasi. Tidak ada satu pun `<select>` bawaan browser (R12) dan tidak ada
 * input teks bebas untuk tanggal (R21). Stage 5 menyambungkan nilainya ke
 * localStorage, bentuk dan aksesibilitasnya sudah final di sini.
 */
export function WorkspaceForm() {
  const [nama, setNama] = useState(workspace.nama);
  const [zona, setZona] = useState('wib');
  const [awal, setAwal] = useState('senin');
  const [bahasa, setBahasa] = useState('id');
  const [jamKerja, setJamKerja] = useState(workspace.jamKerjaPerHari);
  const [hariKerja, setHariKerja] = useState<string[]>(workspace.hariKerja);
  const [mulaiTahunFiskal, setMulaiTahunFiskal] = useState<string | null>('2026-01-01');
  const [notifTelat, setNotifTelat] = useState(true);
  const [notifHarian, setNotifHarian] = useState(false);
  const [wajibEstimasi, setWajibEstimasi] = useState(true);
  const [kepadatanBawaan, setKepadatanBawaan] = useState<'rapat' | 'normal' | 'longgar'>('normal');

  return (
    <div className="grid-2">
      <section className="card">
        <div className="card-head"><h2 className="t-h2 grow">Identitas workspace</h2></div>
        <div className="card-pad stack gap-4">
          <div className="field">
            <label htmlFor="ws-nama">Nama workspace</label>
            <input id="ws-nama" className="input" value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="ws-slug">Alamat workspace</label>
            <input id="ws-slug" className="input" value={workspace.slug} readOnly />
          </div>

          <Select label="Zona waktu" nilai={zona} opsi={OPSI_ZONA} onUbah={setZona} />
          <Select label="Bahasa antarmuka" nilai={bahasa} opsi={OPSI_BAHASA} onUbah={setBahasa} />
          <Select label="Awal minggu" nilai={awal} opsi={OPSI_AWAL_MINGGU} onUbah={setAwal} />

          <DatePicker
            label="Awal tahun fiskal"
            nilai={mulaiTahunFiskal}
            onUbah={setMulaiTahunFiskal}
            bisaDikosongkan={false}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2 className="t-h2 grow">Jam kerja dan kapasitas</h2></div>
        <div className="card-pad stack gap-4">
          <div className="field">
            <label id="ws-jam-label">Jam kerja per hari</label>
            <div className="row gap-3">
              <Stepper nilai={jamKerja} onUbah={setJamKerja} label="Jam kerja per hari" min={1} max={12} satuan="j" />
              <span className="t-ui-sm text-muted">Dipakai menghitung kapasitas mingguan tiap anggota.</span>
            </div>
          </div>

          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="sel-label">Hari kerja</legend>
            <div className="row-wrap gap-3" style={{ marginTop: 'var(--sp-1)' }}>
              {HARI.map((h) => (
                <Checkbox
                  key={h}
                  label={h}
                  checked={hariKerja.includes(h)}
                  onChange={(v) => setHariKerja((s) => (v ? [...s, h] : s.filter((x) => x !== h)))}
                />
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label id="ws-kepadatan">Kepadatan tabel bawaan</label>
            <SegmentedControl
              label="Kepadatan tabel bawaan"
              nilai={kepadatanBawaan}
              onUbah={setKepadatanBawaan}
              opsi={[
                { nilai: 'rapat', label: 'Rapat' },
                { nilai: 'normal', label: 'Normal' },
                { nilai: 'longgar', label: 'Longgar' },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2 className="t-h2 grow">Aturan kerja</h2></div>
        <div className="card-pad stack gap-4">
          <Toggle
            label="Wajib isi estimasi jam"
            keterangan="Tugas tidak bisa dipindahkan ke Sedang Berjalan tanpa estimasi."
            checked={wajibEstimasi}
            onChange={setWajibEstimasi}
          />
          <hr className="divider" />
          <Toggle
            label="Peringatan tugas telat"
            keterangan="Kirim pemberitahuan ke pemilik proyek saat ada tugas lewat tenggat."
            checked={notifTelat}
            onChange={setNotifTelat}
          />
          <hr className="divider" />
          <Toggle
            label="Ringkasan harian"
            keterangan="Kirim ringkasan tugas jatuh tempo setiap pagi jam 08.00."
            checked={notifHarian}
            onChange={setNotifHarian}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-head"><h2 className="t-h2 grow">Informasi</h2></div>
        <div className="card-pad">
          <dl className="def">
            <dt>Mata uang</dt><dd>{workspace.mataUang}</dd>
            <dt>Bahasa produk</dt><dd>{workspace.bahasa}</dd>
            <dt>Zona waktu tersimpan</dt><dd>{workspace.zonaWaktu}</dd>
          </dl>
          <div className="row gap-2" style={{ marginTop: 'var(--sp-5)' }}>
            <button type="button" className="btn btn-primary">Simpan Perubahan</button>
            <button type="button" className="btn btn-ghost">Batalkan</button>
          </div>
        </div>
      </section>
    </div>
  );
}
