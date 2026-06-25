import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(__dirname, '..', '..', '.env') })

const BCRYPT_ROUNDS = 12

async function seed() {
  const email = process.env.SEED_EMAIL?.trim()
  const password = process.env.SEED_PASSWORD
  const fullName = process.env.SEED_FULL_NAME?.trim()

  if (!email || !password || !fullName) {
    console.error(
      'Faltan variables en .env: SEED_EMAIL, SEED_PASSWORD, SEED_FULL_NAME\n' +
      'Agregalas a apps/api/.env antes de correr este script.',
    )
    process.exit(1)
  }

  const ds = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  await ds.initialize()

  const existing = await ds.query(
    `SELECT id FROM dashboard_users WHERE email = $1`,
    [email.toLowerCase()],
  )

  if (existing.length > 0) {
    console.log(`User ${email} already exists (id: ${existing[0].id}). Skipping.`)
    await ds.destroy()
    return
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

  const [inserted] = await ds.query(
    `INSERT INTO dashboard_users (email, password_hash, role, full_name, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, role, full_name, is_active, created_at`,
    [email.toLowerCase(), passwordHash, 'superadmin', fullName, true],
  )

  console.log('Superadmin created:')
  console.log(inserted)

  await ds.destroy()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
