import database from '@/infra/database'

export interface IUser {
  id: string
  name: string
  email: string
  role: 'default' | 'admin'
  password: string
  created_at: Date
  updated_at: Date
}

export interface IUserCreateDTO
  extends Omit<IUser, 'id' | 'created_at' | 'updated_at'> {}

async function create(user: IUserCreateDTO): Promise<IUser> {
  const query = await database.query({
    text: `INSERT INTO "USERS" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    values: [user.name, user.email, user.password]
  })
  return query?.rows[0]
}

async function findOneByEmail(email: string): Promise<IUser | null> {
  const query = await database.query({
    text: `SELECT * FROM "USERS" WHERE email = $1`,
    values: [email]
  })

  if (!query?.rows[0]) return null

  return query?.rows[0]
}

export interface IUserFilter {
  name?: string
  email?: string
  role?: string[]
  query?: string
  sort?: string
}

export interface IPaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalRows: number
    totalPages: number
  }
}

async function filterUsers(
  page: number,
  limit: number,
  filters: IUserFilter
): Promise<IPaginatedResult<IUser>> {
  const offset = (page - 1) * limit
  let filterClauses = []
  let values = []
  let index = 1

  if (filters.name) {
    filterClauses.push(`name ILIKE $${index}`)
    values.push(`${filters.name}%`)
    index++
  }

  if (filters.email) {
    filterClauses.push(`email ILIKE $${index}`)
    values.push(`${filters.email}%`)
    index++
  }

  if (filters.query) {
    const queryPlaceholders = [
      `id::text ILIKE $${index}`,
      `name ILIKE $${index}`,
      `email ILIKE $${index}`,
      `role ILIKE $${index}`
    ]
    filterClauses.push(`(${queryPlaceholders.join(' OR ')})`)
    values.push(`%${filters.query}%`)
    index++
  }

  if (filters.role && filters.role.length > 0) {
    const rolePlaceholders = filters.role.map(() => `$${index++}`).join(', ')
    filterClauses.push(`role IN (${rolePlaceholders})`)
    values.push(...filters.role)
  }

  const filterString =
    filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : ''

  const sortString = filters.sort
    ? `ORDER BY ${filters.sort.split(':')[0]} ${filters.sort.split(':')[1]}`
    : 'ORDER BY id'

  const queryData = `
    SELECT
      id,
      name,
      email,
      role
    FROM 
      "USERS"
    ${filterString}
    ${sortString}
    LIMIT $${index}
    OFFSET $${index + 1}
  `

  values.push(limit, offset)

  const countQueryText = `
    SELECT COUNT(*) AS totalRows
    FROM "USERS"
    ${filterString}
  `

  const query = (await database.query({
    text: queryData,
    values
  })) as { rows: IUser[] }

  const countQuery = await database.query({
    text: countQueryText,
    values: values.slice(0, -2)
  })

  const totalRows = parseInt(countQuery?.rows[0].totalrows, 10)
  const totalPages = Math.ceil(totalRows / limit)

  return {
    data: query?.rows,
    pagination: {
      page,
      limit,
      totalRows,
      totalPages
    }
  }
}

export default Object.freeze({ create, findOneByEmail, filterUsers })
