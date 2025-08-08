import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import '@/styles/main.scss';

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Metropolitan Police Stop & Search Data',
  description: 'Dashboard for police stop and search data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable}`}>
        <div>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
