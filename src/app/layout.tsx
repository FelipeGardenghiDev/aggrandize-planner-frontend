import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aggrandize Planner',
  description: 'Planner front-end com dados mockados, foco em execução e visibilidade operacional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
