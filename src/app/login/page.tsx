import { Metadata } from 'next';
import { Shield } from 'lucide-react';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Login - Vibe Publish',
  description: 'Login to access your dashboard',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md px-6 relative z-10 py-12">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
            Admin System
          </h1>
          <p className="text-sm text-muted-foreground">Welcome back! Please enter your details.</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-foreground mb-6">Sign in to your account</h2>
          <LoginForm />
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
            © 2024 Enterprise Admin System v4.2.0
          </p>
        </div>
      </div>
    </main>
  );
}
