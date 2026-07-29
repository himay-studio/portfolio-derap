import { tanggalRingkas } from '@/lib/dates';

/**
 * Grafik dirender dari data, tidak pernah dari gambar.
 *
 * Seri TIDAK boleh dibedakan hanya oleh warna. Setiap grafik di sini memakai
 * label langsung, pola garis yang berbeda, atau penanda bentuk, supaya tetap
 * terbaca oleh pengguna buta warna (DESIGN.md 2.7).
 */

export function BarChart({
  data,
  label,
  satuan,
}: {
  data: { label: string; nilai: number; warna?: string; keterangan?: string }[];
  label: string;
  satuan?: string;
}) {
  const maks = Math.max(1, ...data.map((d) => d.nilai));
  return (
    <div className="ch" role="img" aria-label={`${label}. ${data.map((d) => `${d.label} ${d.nilai}${satuan ?? ''}`).join(', ')}.`}>
      {data.map((d) => (
        <div key={d.label} className="ch-bar-baris">
          {/* R50. Label dan keterangan dua blok terpisah. */}
          <span className="item-text ch-bar-label">
            <span className="title truncate">{d.label}</span>
            {d.keterangan ? <span className="meta truncate">{d.keterangan}</span> : null}
          </span>
          <span className="ch-bar-track">
            <span
              className="ch-bar-isi"
              style={{ width: `${(d.nilai / maks) * 100}%`, background: d.warna ?? 'var(--chart-1)' }}
            />
          </span>
          <span className="ch-bar-nilai">{d.nilai}{satuan ?? ''}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Burndown sprint. Garis ideal putus putus dan netral, garis nyata solid dan
 * berwarna brand, dengan penanda persegi di tiap titik (R10, tidak ada bulat).
 */
export function Burndown({
  titik,
  total,
  label,
}: {
  titik: { tanggal: string; ideal: number; sisa: number | null }[];
  total: number;
  label: string;
}) {
  const W = 640;
  const H = 220;
  const padKiri = 34;
  const padBawah = 28;
  const padAtas = 12;
  const padKanan = 12;
  const lebar = W - padKiri - padKanan;
  const tinggi = H - padAtas - padBawah;
  const maksY = Math.max(1, total);

  const x = (i: number) => padKiri + (titik.length <= 1 ? 0 : (i / (titik.length - 1)) * lebar);
  const y = (v: number) => padAtas + tinggi - (v / maksY) * tinggi;

  const jalurIdeal = titik.map((t, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(t.ideal).toFixed(1)}`).join(' ');
  const nyata = titik.filter((t) => t.sisa !== null);
  const jalurNyata = nyata
    .map((t, i) => `${i === 0 ? 'M' : 'L'}${x(titik.indexOf(t)).toFixed(1)},${y(t.sisa as number).toFixed(1)}`)
    .join(' ');

  const sumbuY = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maksY * f));

  return (
    <div className="ch">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={`${label}. Total ${total} tugas. Sisa terakhir ${nyata.length > 0 ? nyata[nyata.length - 1].sisa : total} tugas.`}
        preserveAspectRatio="xMidYMid meet"
      >
        {sumbuY.map((v) => (
          <g key={v}>
            <line x1={padKiri} y1={y(v)} x2={W - padKanan} y2={y(v)} stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={padKiri - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{v}</text>
          </g>
        ))}

        {titik.map((t, i) =>
          i % Math.max(1, Math.ceil(titik.length / 6)) === 0 ? (
            <text key={t.tanggal} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
              {tanggalRingkas(t.tanggal)}
            </text>
          ) : null,
        )}

        {/* Ideal: putus putus dan netral. */}
        <path d={jalurIdeal} fill="none" stroke="var(--chart-neutral)" strokeWidth="1.5" strokeDasharray="5 4" />
        {/* Nyata: solid, brand, plus penanda persegi. */}
        <path d={jalurNyata} fill="none" stroke="var(--chart-1)" strokeWidth="2" />
        {nyata.map((t) => (
          <rect
            key={t.tanggal}
            x={x(titik.indexOf(t)) - 3}
            y={y(t.sisa as number) - 3}
            width="6"
            height="6"
            fill="var(--chart-1)"
          />
        ))}
      </svg>

      <div className="ch-legenda">
        <span className="ch-legenda-item">
          <svg width="18" height="8" aria-hidden="true"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--chart-1)" strokeWidth="2" /></svg>
          Sisa tugas, garis solid
        </span>
        <span className="ch-legenda-item">
          <svg width="18" height="8" aria-hidden="true"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--chart-neutral)" strokeWidth="1.5" strokeDasharray="5 4" /></svg>
          Garis ideal, putus putus
        </span>
      </div>
    </div>
  );
}
