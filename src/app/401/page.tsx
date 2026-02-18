'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md px-6 relative z-10 text-center">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 mb-8">
          <ShieldAlert className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-heading mb-4">
          Access Denied
        </h1>

        <p className="text-muted-foreground mb-8">
          Sorry, your account does not have any assigned roles to access this system. Please contact
          your administrator to request access.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </main>
  );
}
