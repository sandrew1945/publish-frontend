import { Button } from '@/components/button';

export interface TablePaginationProps {
    page: number;
    pageSize: number;
    total: number;
    /** Default: [10, 20, 50] */
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

/**
 * Computes visible page slots with ellipsis.
 * Always shows first, last, current ±4, and `…` gaps.
 */
function buildPageSlots(current: number, totalPages: number): (number | '...')[] {
    if (totalPages <= 9) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 4;
    const range: (number | '...')[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(totalPages - 1, current + delta);

    range.push(1);

    if (left > 2) {
        range.push('...');
    }

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < totalPages - 1) {
        range.push('...');
    }

    range.push(totalPages);
    return range;
}

/**
 * Reusable pagination bar with page-size selector and page navigation.
 * Supports ±4 window with ellipsis for large page counts.
 */
export function TablePagination({
    page,
    pageSize,
    total,
    pageSizeOptions = [10, 20, 50],
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const slots = buildPageSlots(page, totalPages);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        // NOTE: reset to page 1 when page size changes to avoid out-of-range pages
        onPageSizeChange(newSize);
        onPageChange(1);
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#14181d] rounded-b-lg">
            {/* Page size selector */}
            <div className="flex items-center text-sm text-neutral-400 gap-2">
                <span>Show</span>
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="bg-[#0d1117] border border-white/10 rounded-md px-2 py-1 h-8 text-white focus:outline-none focus:border-white/20"
                >
                    {pageSizeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <span>per page</span>
                <span className="ml-4 text-neutral-500">
                    {total} total record{total !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1 text-sm">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="h-8 border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                >
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {slots.map((slot, i) =>
                        slot === '...' ? (
                            <span
                                key={`ellipsis-${i}`}
                                className="min-w-8 h-8 flex items-center justify-center text-neutral-500 select-none"
                            >
                                …
                            </span>
                        ) : (
                            <Button
                                key={slot}
                                variant={page === slot ? 'default' : 'ghost'}
                                size="sm"
                                className={`min-w-8 h-8 px-2 rounded-md ${page === slot
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
                                        : 'text-neutral-400 bg-transparent hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => onPageChange(slot as number)}
                            >
                                {slot}
                            </Button>
                        )
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || total === 0}
                    onClick={() => onPageChange(page + 1)}
                    className="h-8 border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
