const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: false
})

seedDatabase()

async function seedDatabase() {
  console.log('[🌱] Seeding database...')

  await client.connect()
  await seedDevelopmentUsers()
  await client.end()

  console.log('[✅] Database seeded!')
}

async function seedDevelopmentUsers() {
  await clearTables()

  await insertUser(
    'Admin',
    'admin@admin.com',
    '$2b$10$ni.FUANtDDg7Kc5JhEDKrO64PBjhXnenzBGdQUvOCnV/m.7M/9az6',
    'admin'
  )
  await insertUser(
    'User',
    'user@user.com',
    '$2b$10$ni.FUANtDDg7Kc5JhEDKrO64PBjhXnenzBGdQUvOCnV/m.7M/9az6',
    'default'
  )

  console.log('==================================')
  console.log(
    '> You can now Login to the application using the following credentials:'
  )
  console.log('')
  console.log('🛡️ As admin:')
  console.log('email: admin@admin.com')
  console.log('password: password')
  console.log('')
  console.log('😎 As user:')
  console.log('email: user@user.com')
  console.log('password: password')
  console.log('')
  console.log('==================================')

  async function insertUser(name, email, password, role) {
    try {
      await client.query({
        text: `INSERT INTO "USERS" (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        values: [name, email, password, role]
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function clearTables() {
    try {
      await client.query({
        text: 'DELETE FROM "USERS"'
      })
      await client.query({
        text: 'DELETE FROM "SESSIONS"'
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
