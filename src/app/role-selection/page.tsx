'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Check, Loader2, UserCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { authService } from '@/lib/auth-service';
import { AclUserBean, TmRolePO } from '@/types/backend-types';
import { toast } from 'sonner';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<TmRolePO | null>(null);

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user && !loading) {
      // logic handled by middleware or auth context usually, but extra safety here
    }
  }, [user, loading, router]);

  const handleRoleSelect = async (role: TmRolePO) => {
    if (!role.roleId) return;

    setSelectedRole(role);
    setLoading(true);

    try {
      // 1. Set the role on the backend
      const res = await authService.setCurrentlyRole({ roleId: role.roleId });

      if (res.result) {
        // 2. Refresh the local user state to reflect the role change
        await checkAuth();

        // 3. Redirect to dashboard
        toast.success(`Switched to ${role.roleName || 'selected role'}`);
        router.push('/dashboard');
      } else {
        toast.error(res.msg || 'Failed to switch role');
        setLoading(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Role selection error:', error);
      toast.error('An error occurred while selecting role');
      setLoading(false);
      setSelectedRole(null);
    }
  };

  // Cast roleList to TmRolePO[] because definitions might be loose
  const roles = (user?.roleList as TmRolePO[]) || [];

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradients - matching login page */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-lg px-6 relative z-10 py-12">
        <div className="text-center mb-8 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <UserCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
            Select Your Role
          </h1>
          <p className="text-sm text-muted-foreground">
            Please choose a role to continue to the dashboard.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {roles.length > 0 ? (
              roles.map((role) => (
                <motion.button
                  key={role.roleId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 outline-none
                    ${
                      selectedRole?.roleId === role.roleId
                        ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'bg-muted/30 border-white/10 hover:bg-muted/50 hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      h-10 w-10 rounded-lg flex items-center justify-center transition-colors
                      ${selectedRole?.roleId === role.roleId ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground group-hover:bg-blue-500/20 group-hover:text-blue-500'}
                    `}
                    >
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3
                        className={`font-semibold ${selectedRole?.roleId === role.roleId ? 'text-blue-500' : 'text-foreground'}`}
                      >
                        {role.roleName}
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {role.roleCode}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                    h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedRole?.roleId === role.roleId
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-muted-foreground/30 group-hover:border-blue-500/50'
                    }
                  `}
                  >
                    {selectedRole?.roleId === role.roleId && <Check className="h-3 w-3" />}
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No roles available.</div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Start Over
          </button>
        </div>
      </div>
    </main>
  );
}
