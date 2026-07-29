import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke demo Derap. Kredensial demo ditampilkan langsung di layar, satu klik langsung masuk.',
};

export default function Login() {
  return <LoginForm />;
}
