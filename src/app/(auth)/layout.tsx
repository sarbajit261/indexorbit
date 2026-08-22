import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Back to site button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors shadow-sm"
        >
          <Globe className="h-4 w-4" />
          Back to site
        </Link>
      </div>

      {children}
    </div>
  );
}
