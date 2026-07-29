import Link from 'next/link';
import { EmptyState } from '@/components/ui/Primitives';

export default function TidakDitemukan() {
  return (
    <div className="lg">
      <div className="lg-kartu">
        <EmptyState
          ragam="kotak"
          judul="Halaman tidak ditemukan"
          penjelasan="Alamat yang kamu buka tidak ada di aplikasi ini. Kembali ke Dashboard untuk melanjutkan."
          aksi={<Link href="/app/" className="btn btn-primary">Kembali ke Dashboard</Link>}
        />
      </div>
    </div>
  );
}
