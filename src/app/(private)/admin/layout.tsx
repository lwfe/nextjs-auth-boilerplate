'use client'

import { IUser } from '@/models/user'
import encryption from '@/models/encryption'

import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { getCookie } from 'cookies-next'
import { Sidebar } from './components/sidebar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const userId = getCookie('user')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    ;(async () => {
      const decryptedUserId = encryption.decrypt(userId as string)
      const user = (await fetch(`/api/v1/users/${decryptedUserId}`).then(res =>
        res.json()
      )) as IUser
      if (user.role !== 'admin') return (window.location.href = '/')
      setIsAdmin(true)
    })()
  }, [userId])

  if (!isAdmin) return <></>

  return (
    <main className="h-full flex">
      <Sidebar
        accounts={[
          { email: 'admin@admin.com', icon: <User />, label: 'Admin' }
        ]}
        defaultLayout={[265, 440, 655]}
        navCollapsedSize={4}
      >
        {children}
      </Sidebar>
    </main>
  )
}
