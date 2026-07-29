import { PageTransition } from '@/components/shell/PageTransition';
import { Sidebar } from '@/components/shell/Sidebar';
import { Topbar } from '@/components/shell/Topbar';

/**
 * Kerangka aplikasi. Sidebar kiri permanen di atas 1024px, topbar 56px, lalu
 * isi halaman. Ini APLIKASI, jadi navigasi utama tidak pernah pindah ke
 * topbar dan tidak ada mega menu di sini.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell-main">
        <Topbar />
        <main className="shell-konten" id="konten">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
