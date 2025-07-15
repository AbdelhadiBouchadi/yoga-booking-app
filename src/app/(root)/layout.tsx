import Navbar from '@/components/root/Navbar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans">
      <Navbar />
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
