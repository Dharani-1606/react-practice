import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';

const BASE_URL = "https://rickandmortyapi.com/api/";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

const columns: ColumnDef<Character>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'species', header: 'Species' },
  { accessorKey: 'gender', header: 'Gender' },
];

const DataTableDemo = () => {
  // Track page index (0-based for TanStack, API is 1-based)
  const [pageIndex, setPageIndex] = useState(0);

  // Fetch from Rick & Morty API with current page
  const { data, error, isLoading } = useSWR(`${BASE_URL}character?page=${pageIndex + 1}`,fetcher);

  const characters = data?.results as Character[] | undefined;
  const totalPages = data?.info?.pages ?? 0;

  const table = useReactTable({
    data: useMemo(() => characters ?? [], [characters]),
    columns,
    pageCount: totalPages, // server-side page count
    state: {
      pagination: {
        pageIndex,
        pageSize: 20, // API returns 20 items per page
      },
    },
    manualPagination: true, // important for server-side mode
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize: 20 });
        setPageIndex(newState.pageIndex);
      } else {
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading characters…</div>;
  if (error) return <div>Error fetching characters.</div>;

  return (
    <div>
      <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {pageIndex + 1} of {totalPages}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTableDemo;
