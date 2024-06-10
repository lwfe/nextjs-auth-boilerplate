import { Table } from './components/table'

export default async function AdminPage({
  searchParams
}: {
  searchParams?: {
    query?: string
    role?: string
    page?: string
    limit?: string
    sort?: string
  }
}) {
  const query = searchParams?.query || ''
  const role = searchParams?.role || ''
  const page = searchParams?.page || ''
  const limit = searchParams?.limit || ''
  const sort = searchParams?.sort || ''

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
      <Table
        params={{
          query,
          limit,
          page,
          role,
          sort
        }}
      />
    </div>
  )
}
