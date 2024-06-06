'use client'
import { columns } from './columns'
import { useCallback, useEffect, useState } from 'react'
import { IPaginatedResult, IUser } from '@/models/user'
import { DataTable } from '@/components/table/data-table'

interface Params {
  query: string
  role: string
  page: string
  limit: string
}

export function Table({ params }: { params: Params }) {
  const [data, setData] = useState<IPaginatedResult<IUser>>({
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      totalRows: 0,
      totalPages: 0
    }
  })

  const fetchData = useCallback(async () => {
    const clearParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '')
    )

    const result = await fetch(
      '/api/v1/users?' + new URLSearchParams(clearParams)
    )
      .then(res => res.json())
      .then(data => data as IPaginatedResult<IUser>)
    setData(result)
  }, [params])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <DataTable
        data={data.data}
        columns={columns}
        pagination={data.pagination}
      />
    </div>
  )
}
