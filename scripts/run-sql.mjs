import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'

async function run() {
  const file = process.argv[2]
  if (!file) throw new Error('SQL file path required')
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('DATABASE_URL missing')

  const sqlPath = path.resolve(file)
  const sqlText = fs.readFileSync(sqlPath, 'utf8')

  const segments = sqlText.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)

  const conn = await mysql.createConnection({ uri, ssl: { rejectUnauthorized: true } })
  try {
    for (const segment of segments) {
      try {
        await conn.query(segment)
      } catch (e) {
        const msg = String(e?.sqlMessage || e?.message || '')
        const code = e?.code
        if (
          code === 'ER_TABLE_EXISTS_ERROR' ||
          code === 'ER_DUP_KEYNAME' ||
          msg.includes('already exists') ||
          msg.includes('Duplicate')
        ) {
          continue
        }
        throw e
      }
    }
    console.log('Executed SQL file:', sqlPath)
  } finally {
    await conn.end()
  }
}

run().catch((e) => { console.error(e); process.exit(1) })
