'use client'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PrivateLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const route = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const tokenExists = getCookie('sessionId')
    if (!tokenExists) {
      route.push('/login')
    } else {
      setAuthenticated(true)
    }
  }, [route])

  return authenticated ? <>{children}</> : <></>
}
