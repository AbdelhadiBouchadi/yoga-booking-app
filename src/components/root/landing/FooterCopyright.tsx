export default function FooterCopyright() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background/50 border-border/20 text-muted-foreground border-t py-8 text-center text-sm">
      <div className="container mx-auto px-4 md:px-6">
        <p>&copy; {currentYear} La Fabrique Du Bonheur. All rights reserved.</p>
      </div>
    </footer>
  );
}
