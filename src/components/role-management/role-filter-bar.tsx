import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SystemCodeTypes, getCodesByType } from '@/config/fixcode';
import { RoleFilter } from '@/services/role-management-service';

interface RoleFilterBarProps {
  onSearch: (filter: RoleFilter) => void;
  isLoading?: boolean;
}

export function RoleFilterBar({ onSearch, isLoading }: RoleFilterBarProps) {
  const [filter, setFilter] = useState<RoleFilter>({});

  const statusOptions = getCodesByType(SystemCodeTypes.STATUS);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(filter);
  };

  const handleReset = () => {
    const emptyFilter = {};
    setFilter(emptyFilter);
    onSearch(emptyFilter);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-wrap items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
    >
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by Role Code"
          value={filter.roleCode || ''}
          onChange={(e) => setFilter({ ...filter, roleCode: e.target.value })}
          className="bg-black/20 border-white/10 focus:ring-primary/50"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by Role Name"
          value={filter.roleName || ''}
          onChange={(e) => setFilter({ ...filter, roleName: e.target.value })}
          className="bg-black/20 border-white/10 focus:ring-primary/50"
        />
      </div>

      <div className="w-[180px]">
        <select
          value={filter.roleStatus?.toString() || ''}
          onChange={(e) => {
            const val = e.target.value;
            setFilter({ ...filter, roleStatus: val ? Number(val) : undefined });
          }}
          className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className="bg-neutral-900 text-white">
            Status: All
          </option>
          {statusOptions.map((opt) => (
            <option key={opt.code} value={opt.code} className="bg-neutral-900 text-white">
              {opt.code_desc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isLoading} variant="default" className="w-[100px]">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="w-[100px] border-white/10 text-white hover:bg-white/10 hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
}
