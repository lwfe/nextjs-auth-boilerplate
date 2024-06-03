'use client'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const route = useRouter()
  const [authenticated, setAuthenticated] = useState(true)

  useEffect(() => {
    const tokenExists = getCookie('sessionId')
    if (tokenExists) {
      route.push('/')
    } else {
      setAuthenticated(false)
    }
  }, [route])

  return authenticated ? <></> : <>{children}</>
}
