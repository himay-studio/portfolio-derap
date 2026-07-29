'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { demoLogin, site } from '@/data/site';
import { KUNCI, tulisLocal } from '@/lib/storage';

/**
 * Login demo. Tidak ada autentikasi nyata dan tidak ada backend, kredensialnya
 * sengaja ditampilkan di layar supaya siapa pun bisa masuk dengan satu klik.
 */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(demoLogin.email);
  const [sandi, setSandi] = useState<string>(demoLogin.sandi);

  const masuk = (e: React.FormEvent) => {
    e.preventDefault();
    tulisLocal(KUNCI.masuk, true);
    router.push('/app/');
  };

  return (
    <div className="lg">
      <div className="lg-kartu">
        <div className="lg-merek">
          {/* Latar terang, jadi varian primary (R43). */}
          <Link href="/" className="lockup" aria-label={site.nama}>
            <Image src="/mark-derap.svg" alt="" width={32} height={32} priority />
            <span className="lockup-text">
              <span className="lockup-name">{site.nama}</span>
              <span className="lockup-tagline text-muted">{site.taglinePendek}</span>
            </span>
          </Link>
        </div>

        <div className="item-text">
          <h1 className="title t-h1">Masuk ke demo</h1>
          <p className="meta t-ui-sm">
            Ini demo portfolio, jadi tidak ada autentikasi nyata. Kredensialnya ada di bawah, tinggal klik Masuk.
          </p>
        </div>

        <dl className="lg-kredensial def">
          <dt>Email</dt>
          <dd>{demoLogin.email}</dd>
          <dt>Kata sandi</dt>
          <dd>{demoLogin.sandi}</dd>
          <dt>Masuk sebagai</dt>
          <dd>{demoLogin.peran}</dd>
        </dl>

        <form className="lg-form" onSubmit={masuk}>
          <div className="field">
            <label htmlFor="lg-email">Email</label>
            <input
              id="lg-email"
              type="email"
              className="input"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lg-sandi">Kata sandi</label>
            <input
              id="lg-sandi"
              type="password"
              className="input"
              value={sandi}
              autoComplete="current-password"
              onChange={(e) => setSandi(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-cta">Masuk sebagai demo</button>
        </form>

        <p className="lg-kaki">
          <Link href="/">Kembali ke halaman depan</Link>
        </p>
      </div>

      <p className="lg-kaki">
        <a href={site.studioUrl} target="_blank" rel="noopener">
          Dibuat oleh {site.studio}
        </a>
      </p>
    </div>
  );
}
