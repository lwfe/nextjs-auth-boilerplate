import { columns } from './components/table/columns'
import { DataTable } from './components/table/data-table'

export default function AdminPage() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8 overflow-y-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of users registered in your app
          </p>
        </div>
      </div>
      <DataTable
        data={Array.from({ length: 40 }).map((_, index) => ({
          id: index,
          label: 'bug',
          title: 'title',
          status: 'open',
          priority: 'low'
        }))}
        columns={columns}
      />
    </div>
  )
}
