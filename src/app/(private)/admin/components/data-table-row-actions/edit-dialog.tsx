'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { IUser } from '@/models/user'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email is required')
})

export function EditDialog({ user }: { user: IUser }) {
  const { toast } = useToast()
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      name: user.name
    }
  })

  function reload() {
    const params = new URLSearchParams(searchParams)
    !params.has('page') ? params.set('page', '1') : params.delete('page')
    !params.has('limit') ? params.set('limit', '10') : params.delete('limit')
    replace(`${pathname}?${params.toString()}`)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.email === user.email && values.name === user.name) return
    setLoading(true)
    try {
      await fetch(`/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      setOpen(false)
      reload()
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1.5 rounded-md w-full text-start text-sm hover:bg-secondary">
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        placeholder="shadcn"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-3"
                        placeholder="shadcn"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
