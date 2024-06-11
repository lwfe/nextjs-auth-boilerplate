'use client'

import { IUser } from '@/models/user'

import { Row } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { EditDialog } from './edit-dialog'
import { DeleteDialog } from './delete-dialog'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  function reload() {
    const params = new URLSearchParams(searchParams)
    !params.has('page') ? params.set('page', '1') : params.delete('page')
    !params.has('limit') ? params.set('limit', '10') : params.delete('limit')
    replace(`${pathname}?${params.toString()}`)
  }

  async function handleChangeRole(role: string) {
    if (role === (row.original as IUser).role) return
    try {
      await fetch(`/api/v1/users/${(row.original as IUser).id}`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      reload()
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <EditDialog user={row.original as IUser} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup>
              {[
                { value: 'admin', label: 'Admin' },
                { value: 'default', label: 'Default' }
              ].map(label => (
                <DropdownMenuRadioItem
                  key={label.value}
                  onSelect={() => handleChangeRole(label.value)}
                  value={label.value}
                >
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteDialog user={row.original as IUser} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
