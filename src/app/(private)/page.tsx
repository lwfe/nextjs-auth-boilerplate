'use client'
import { LogOut } from 'lucide-react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const route = useRouter()
  const sessionId = getCookie('sessionId')

  async function handleSignOut() {
    await fetch(`/api/v1/sessions/${sessionId}`, { method: 'DELETE' })
    route.replace('/login')
  }

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <span className="text-sm">Start developing your private pages here</span>
      <p className="text-sm mt-2">
        try editing{' '}
        <span className="py-0.5 px-1.5 text-sm bg-slate-100 rounded-md ">
          (private)/page.tsx
        </span>{' '}
      </p>

      <Button
        onClick={handleSignOut}
        className="mt-8 text-destructive"
        variant={'ghost'}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </Button>
    </main>
  )
}
