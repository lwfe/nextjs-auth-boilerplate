'use client'

import { Cross2Icon } from '@radix-ui/react-icons'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { DataTableToolbarProps } from '@/components/table/data-table'
import { DataTableViewOptions } from '@/components/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/table/data-table-faceted-filter'

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const isFiltered = table
    .getAllColumns()
    .some(column => searchParams.has(column.id))

  function clearFilter() {
    const params = new URLSearchParams(searchParams)
    table.getAllColumns().forEach(column => params.delete(column.id))
    replace(`${pathname}?${params.toString()}`)
  }

  if (!table) return null

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Default', value: 'default' }
            ]}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => clearFilter()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
