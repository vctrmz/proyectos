import type { Metadata } from 'next';
import RootShell from '@/components/layout/RootShell';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="es">{children}</RootShell>;
}
