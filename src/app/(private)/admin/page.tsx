'use client'
import { LogOut } from 'lucide-react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const route = useRouter()
  const sessionId = getCookie('sessionId')

  async function handleSignOut() {
    await fetch(`/api/v1/sessions/${sessionId}`, { method: 'DELETE' })
    route.replace('/login')
  }

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <span className="text-sm">Admin Page</span>

      <Button
        variant={'ghost'}
        onClick={handleSignOut}
        className="mt-8 text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </main>
  )
}
