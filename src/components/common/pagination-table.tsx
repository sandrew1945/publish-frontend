import React, { type ReactNode } from 'react';
import { Star } from 'lucide-react';
import { getCodeDesc } from '@/config/fixcode';
import { TablePagination, type TablePaginationProps } from './table-pagination';

// ─── Column Type Definitions ────────────────────────────────────────────────

export type ColumnAlign = 'left' | 'center' | 'right';

interface BaseColumn {
  /** Unique key for the column, also used as React key */
  name: string;
  /** Header label displayed in <thead> */
  label: string;
  /** Record field key to bind data from */
  field: string;
  /** CSS width string, e.g. '120px' or '20%' */
  width?: string;
  /** Text alignment for column cells */
  align?: ColumnAlign;
  /** Reserved for future server-side sort support */
  sortable?: boolean;
}

interface DataColumn extends BaseColumn {
  type: 'data';
}

interface FixcodeColumn extends BaseColumn {
  type: 'fixcode';
  /** System code type ID passed to getCodeDesc() */
  codeTypeId: number;
}

interface IndexColumn extends BaseColumn {
  type: 'index';
}

interface RateColumn extends BaseColumn {
  type: 'rate';
  /** Per-star colour array; e.g. ['#99A9BF', '#F7BA2A', '#FF9900'] */
  colors: string[];
}

interface SelectionColumn extends BaseColumn {
  type: 'selection';
}

interface SlotColumn<T> extends BaseColumn {
  type: 'slot';
  /** Custom cell renderer — receives the full record */
  render: (record: T) => ReactNode;
}

interface TimeColumn extends BaseColumn {
  type: 'time';
}

interface DateColumn extends BaseColumn {
  type: 'date';
  /** Date format string, e.g. 'MM-DD-YYYY'. Defaults to 'YYYY-MM-DD' */
  format?: string;
}

/** Discriminated union of all supported column definition types */
export type ColumnDef<T extends object> =
  | DataColumn
  | FixcodeColumn
  | IndexColumn
  | RateColumn
  | SelectionColumn
  | SlotColumn<T>
  | TimeColumn
  | DateColumn;

// ─── Component Props ─────────────────────────────────────────────────────────

export interface PaginationTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  /** Number of skeleton rows while loading. Defaults to pageSize (min 5). */
  skeletonRows?: number;
  /** Called when user changes page or page size via the built-in pagination */
  query?: () => void;
  // Pagination state (owned by parent)
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: TablePaginationProps['pageSizeOptions'];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  /** Row key extractor — defaults to record index if omitted */
  rowKey?: (record: T, index: number) => string | number;
  /** Controlled selection keys for `selection` column type */
  selectedKeys?: Set<string | number>;
  onSelectChange?: (keys: Set<string | number>) => void;
  /** Placeholder text when data is empty */
  emptyText?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Simple date formatter
 * Supports YYYY, YY, MM, DD, HH, mm, ss
 */
function formatDate(dateValue: string | number | Date, formatStr: string): string {
  if (!dateValue) return '-';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '-';

  const pad = (n: number) => n.toString().padStart(2, '0');
  // Order matters for replacing (e.g., YYYY before YY)
  const tokens: Record<string, string> = {
    YYYY: d.getFullYear().toString(),
    YY: d.getFullYear().toString().slice(-2),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };

  let result = formatStr;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value);
  }
  return result;
}

/**
 * Renders a shimmer placeholder cell for the skeleton loading state.
 */
function SkeletonCell() {
  return (
    <td className="px-4 py-4">
      <div className="h-4 rounded bg-white/5 animate-pulse" />
    </td>
  );
}

/**
 * Renders up to 5 star icons with per-star colour based on the numeric value.
 */
function RateCell({ value, colors }: { value: number; colors: string[] }) {
  const MAX_STARS = 5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_STARS }, (_, i) => {
        const filled = i < value;
        const color = filled ? (colors[i] ?? '#F7BA2A') : '#374151';
        return (
          <Star
            key={i}
            className="w-3.5 h-3.5"
            style={{ color, fill: filled ? color : 'transparent' }}
          />
        );
      })}
    </div>
  );
}

/**
 * Resolves the cell content for a given column definition and record.
 * NOTE: We cast record to Record<string, unknown> for generic field access;
 * typed slot columns receive the original T-typed record via column.render(record).
 */
function renderCell<T extends object>(
  column: ColumnDef<T>,
  record: T,
  rowIndex: number,
  page: number,
  pageSize: number,
  selectedKeys: Set<string | number>,
  onSelectChange?: (keys: Set<string | number>) => void,
  rowKey?: string | number
): ReactNode {
  // HACK: generic field lookup — safe because field names come from the column definition
  const rawValue = (record as Record<string, unknown>)[column.field];

  switch (column.type) {
    case 'data':
      return (
        <span className="text-neutral-300">
          {rawValue != null && rawValue !== '' ? String(rawValue) : '-'}
        </span>
      );

    case 'fixcode':
      return (
        <span className="text-neutral-300">
          {rawValue != null && rawValue !== '' ? getCodeDesc(column.codeTypeId, rawValue as number | string) : '-'}
        </span>
      );

    case 'index':
      // NOTE: offset by (page - 1) * pageSize so the index is globally sequential
      return (
        <span className="text-neutral-400 tabular-nums">
          {(page - 1) * pageSize + rowIndex + 1}
        </span>
      );

    case 'rate':
      return <RateCell value={Number(rawValue ?? 0)} colors={column.colors} />;

    case 'selection': {
      const key = rowKey ?? rowIndex;
      const checked = selectedKeys.has(key);
      const handleChange = () => {
        const next = new Set(selectedKeys);
        if (checked) {
          next.delete(key);
        } else {
          next.add(key);
        }
        onSelectChange?.(next);
      };
      return (
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="w-4 h-4 rounded border-white/20 bg-[#0d1117] accent-blue-600 cursor-pointer"
        />
      );
    }

    case 'time':
      return (
        <span className="text-neutral-300">
          {rawValue ? new Date(rawValue as string | number | Date).toLocaleString() : '-'}
        </span>
      );

    case 'date':
      return (
        <span className="text-neutral-300">
          {rawValue ? formatDate(rawValue as string | number | Date, column.format || 'YYYY-MM-DD') : '-'}
        </span>
      );

    case 'slot':
      return column.render(record);

    default:
      return null;
  }
}

/**
 * Returns the text-align CSS class for a given alignment value.
 */
function alignClass(align?: ColumnAlign): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

// ─── PaginationTable ──────────────────────────────────────────────────────────

/**
 * Generic, column-definition-driven table with Skeleton loading,
 * multiple column types, and an integrated TablePagination bar.
 *
 * @template T - Shape of each data record (must extend object).
 */
export function PaginationTable<T extends object>({
  data,
  columns,
  isLoading = false,
  skeletonRows,
  query,
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  rowKey,
  selectedKeys = new Set(),
  onSelectChange,
  emptyText = 'No data found',
}: PaginationTableProps<T>) {
  // NOTE: skeletonRows defaults to pageSize but is always at least 5
  const effectiveSkeletonRows = Math.max(skeletonRows ?? pageSize, 5);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    query?.();
  };

  const handlePageSizeChange = (newSize: number) => {
    onPageSizeChange(newSize);
    query?.();
  };

  return (
    <div className="flex flex-col flex-1 bg-[#0d1117] rounded-lg border border-white/10">
      {/* Table */}
      <div className="flex-1 overflow-auto rounded-t-lg">
        <table className="w-full text-sm text-left border-collapse">
          {/* Header */}
          <thead className="text-[11px] text-neutral-400 uppercase tracking-widest border-b border-white/10 bg-[#14181d] sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className={`px-4 py-3 font-semibold ${alignClass(col.align)}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: effectiveSkeletonRows }, (_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="bg-[#0d1117]">
                  {columns.map((col) => (
                    <SkeletonCell key={col.name} />
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-neutral-500 bg-[#0d1117]"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((record, rowIdx) => {
                const key = rowKey ? rowKey(record, rowIdx) : rowIdx;
                return (
                  <tr
                    key={key}
                    className="hover:bg-white/[0.02] transition-colors group bg-[#0d1117]"
                  >
                    {columns.map((col) => (
                      <td key={col.name} className={`px-4 py-4 ${alignClass(col.align)}`}>
                        {renderCell(
                          col,
                          record,
                          rowIdx,
                          page,
                          pageSize,
                          selectedKeys,
                          onSelectChange,
                          key
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Integrated pagination bar */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={pageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
