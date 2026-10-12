import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Mero Pasal - Shop Inventory & POS Management System',
  description: 'Smart Nepali Point of Sale (POS), Inventory Control, Customer Udharo Khata, and Tax Invoice Billing Web Application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
