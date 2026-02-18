import { SystemCodeTypes, SystemStatus, getCodeDesc } from '@/config/fixcode';

interface RoleStatusBadgeProps {
  status?: number;
}

export function RoleStatusBadge({ status }: RoleStatusBadgeProps) {
  if (status === undefined) return null;

  const label = getCodeDesc(SystemCodeTypes.STATUS, status);

  // Use loose equality to handle string/number mismatch
  const isInactive = status == SystemStatus.INACTIVE || label === '无效';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        isInactive
          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : 'bg-green-500/10 text-green-400 border border-green-500/20'
      }`}
    >
      {label}
    </span>
  );
}
