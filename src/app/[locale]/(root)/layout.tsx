import Navbar from '@/components/root/Navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const { locale } = await params;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="font-sans">
        <Navbar />
        <main className="container mx-auto">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
