import { useState } from 'react'

import { IUser } from '@/models/user'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function DeleteDialog({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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

  async function deleteUser() {
    setLoading(true)
    try {
      await fetch(`/api/v1/users/${user.id}`, {
        method: 'DELETE'
      })
      setOpen(false)
      reload()
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1.5 rounded-md w-full text-start text-sm hover:bg-secondary">
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete user
            account and remove user data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={deleteUser}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
