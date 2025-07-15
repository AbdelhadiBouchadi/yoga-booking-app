import type { Metadata } from 'next';
import { Dancing_Script, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const agrandir = localFont({
  src: './fonts/Agrandir.woff2',
  variable: '--font-agrandir',
});

const agrandirNarrow = localFont({
  src: './fonts/Agrandir-Narrow-Medium.woff2',
  variable: '--font-agrandir-narrow',
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfairDisplay',
});

const dancingScript = Dancing_Script({
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancingScript',
});

export const metadata: Metadata = {
  title: 'La Fabrique Du Bonheur',
  description:
    'Bienvenue à La Fabrique du Bonheur Un espace expérimental où la créativité se joint au mouvement pour se libérer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${agrandir.variable} ${agrandirNarrow.variable} ${playfairDisplay.variable} ${dancingScript.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
