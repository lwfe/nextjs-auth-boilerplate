'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  function handleChangeLimit(limit: number) {
    const params = new URLSearchParams(searchParams)
    if (limit) {
      params.set('limit', limit.toString())
    } else {
      params.delete('limit')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  function handleFirstPage() {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  function handlePreviousPage() {
    const currentPage = table.getState().pagination.pageIndex + 1
    const params = new URLSearchParams(searchParams)
    if (currentPage > 0) {
      params.set('page', (currentPage - 1).toString())
    } else {
      params.delete('page')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  function handleLastPage() {
    const params = new URLSearchParams(searchParams)
    params.set('page', table.getPageCount().toString())
    replace(`${pathname}?${params.toString()}`)
  }

  function handleNextPage() {
    const currentPage = table.getState().pagination.pageIndex + 1
    const params = new URLSearchParams(searchParams)
    if (currentPage < table.getPageCount()) {
      params.set('page', (currentPage + 1).toString())
    } else {
      params.delete('page')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              handleChangeLimit(Number(value))
            }}
            defaultValue={searchParams.get('limit')?.toString()}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleFirstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePreviousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleNextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleLastPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
