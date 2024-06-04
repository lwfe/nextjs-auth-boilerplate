import { User } from 'lucide-react'
import { Sidebar } from './components/sidebar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
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
