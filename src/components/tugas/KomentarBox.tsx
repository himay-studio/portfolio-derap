'use client';

import { useId, useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Primitives';
import type { KomentarTugas } from '@/data/types';
import { anggotaById, penggunaSaatIni } from '@/data/team';
import { cariAnggotaUntukMention, renderKomentar } from '@/lib/mentions';

/**
 * Kotak tulis komentar dengan mention `@`. Bukan komponen dropdown penuh
 * (R12 tetap dijaga oleh `Select`), ini popover kecil khusus mengetik yang
 * menyisipkan `@Nama Lengkap` pada posisi kursor lalu menutup dirinya sendiri.
 */
export function KomentarBox({
  komentar,
  onKirim,
}: {
  komentar: KomentarTugas[];
  onKirim: (isi: string) => void;
}) {
  const [teks, setTeks] = useState('');
  const [mentionAktif, setMentionAktif] = useState(false);
  const [queryMention, setQueryMention] = useState('');
  const idKotak = useId();
  const ref = useRef<HTMLTextAreaElement>(null);

  const cocok = mentionAktif ? cariAnggotaUntukMention(queryMention) : [];

  const padaUbah = (v: string) => {
    setTeks(v);
    const posisi = ref.current?.selectionStart ?? v.length;
    const sebelumKursor = v.slice(0, posisi);
    const m = sebelumKursor.match(/@([\p{L}\s]{0,24})$/u);
    if (m) {
      setMentionAktif(true);
      setQueryMention(m[1]);
    } else {
      setMentionAktif(false);
    }
  };

  const pilihMention = (nama: string) => {
    const el = ref.current;
    const posisi = el?.selectionStart ?? teks.length;
    const sebelum = teks.slice(0, posisi).replace(/@([\p{L}\s]{0,24})$/u, `@${nama} `);
    const sesudah = teks.slice(posisi);
    const baru = `${sebelum}${sesudah}`;
    setTeks(baru);
    setMentionAktif(false);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(sebelum.length, sebelum.length);
    });
  };

  const kirim = () => {
    if (!teks.trim()) return;
    onKirim(teks);
    setTeks('');
    setMentionAktif(false);
  };

  return (
    <div className="stack gap-4">
      {komentar.length === 0 ? (
        <p className="t-ui-sm text-muted">Belum ada komentar. Tulis catatan pertama untuk tim.</p>
      ) : (
        <ul className="stack gap-4">
          {komentar.map((k) => {
            const penulis = anggotaById(k.penulisId);
            return (
              <li key={k.id} className="row gap-3" style={{ alignItems: 'flex-start' }}>
                {penulis ? <Avatar inisial={penulis.inisial} warna={penulis.warna} ukuran={32} nama={penulis.nama} /> : null}
                <span className="item-text grow">
                  <span className="title">{penulis?.nama ?? 'Anonim'}</span>
                  <span className="meta">{k.waktu}</span>
                  <span className="t-body" style={{ marginTop: 'var(--sp-1)' }}>{renderKomentar(k.isi)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="komentar-tulis">
        <label className="sr-only" htmlFor={idKotak}>Tulis komentar, ketik @ untuk menyebut anggota tim</label>
        <textarea
          id={idKotak}
          ref={ref}
          className="textarea"
          placeholder="Tulis komentar, ketik @ untuk menyebut anggota tim"
          value={teks}
          onChange={(e) => padaUbah(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && mentionAktif) { e.preventDefault(); setMentionAktif(false); return; }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); kirim(); }
          }}
        />

        {mentionAktif ? (
          <div className="komentar-mention pop pop-left" role="listbox" aria-label="Sebut anggota tim">
            <div className="pop-anim-inner">
              {cocok.length === 0 ? (
                <p className="t-caption text-muted" style={{ padding: 'var(--sp-2) var(--sp-3)' }}>Tidak ada anggota yang cocok.</p>
              ) : (
                <ul className="sel-list">
                  {cocok.map((a) => (
                    <li key={a.id} role="option" aria-selected={false} className="sel-opt" onPointerDown={(e) => { e.preventDefault(); pilihMention(a.nama); }}>
                      <Avatar inisial={a.inisial} warna={a.warna} ukuran={24} />
                      <span className="item-text grow">
                        <span className="title">{a.nama}</span>
                        <span className="meta">{a.peran}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}

        <div className="row gap-2" style={{ marginTop: 'var(--sp-2)' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={kirim} disabled={!teks.trim()}>
            Kirim komentar
          </button>
          <span className="t-caption text-muted">Dikirim sebagai {penggunaSaatIni.nama}. Ctrl atau Cmd plus Enter juga mengirim.</span>
        </div>
      </div>
    </div>
  );
}
