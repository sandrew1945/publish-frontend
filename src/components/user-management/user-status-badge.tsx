import { SystemCodeTypes, SystemStatus, SystemEmployeeStatus, getCodeDesc } from '@/config/fixcode';

interface UserStatusBadgeProps {
  status?: number;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  if (status === undefined) return null;

  let label = getCodeDesc(SystemCodeTypes.STATUS, status);
  // Fallback to Employee Status if not found in standard Status
  if (label === String(status)) {
    label = getCodeDesc(SystemCodeTypes.EMPLOYEE_STATUS, status);
  }

  // Use loose equality to handle string/number mismatch
  const isInactive =
    status == SystemStatus.INACTIVE ||
    status == SystemEmployeeStatus.RESIGNED ||
    status == SystemEmployeeStatus.RETIRED ||
    status == SystemEmployeeStatus.EARLY_RETIREMENT ||
    label === '无效' || label === '离职';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${isInactive
        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
        : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}
    >
      {label}
    </span>
  );
}
