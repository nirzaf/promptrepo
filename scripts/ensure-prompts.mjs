import mysql from 'mysql2/promise'

async function ensure() {
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('DATABASE_URL missing')
  const conn = await mysql.createConnection({ uri, ssl: { rejectUnauthorized: true } })
  const [rows] = await conn.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'prompts'"
  )
  const exists = rows[0].cnt > 0
  if (!exists) {
    await conn.query(`CREATE TABLE \`prompts\` (
      \`id\` varchar(255) NOT NULL,
      \`userId\` varchar(255) NOT NULL,
      \`slug\` varchar(255) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`content\` text NOT NULL,
      \`description\` text,
      \`instructions\` text,
      \`exampleOutput\` text,
      \`variables\` json,
      \`categoryId\` varchar(255),
      \`aiModelId\` varchar(255),
      \`visibility\` enum('public','private','unlisted') DEFAULT 'public',
      \`status\` enum('draft','published','archived') DEFAULT 'published',
      \`isFeatured\` boolean DEFAULT false,
      \`isStaffPick\` boolean DEFAULT false,
      \`viewCount\` int DEFAULT 0,
      \`copyCount\` int DEFAULT 0,
      \`bookmarkCount\` int DEFAULT 0,
      \`forkCount\` int DEFAULT 0,
      \`shareCount\` int DEFAULT 0,
      \`commentCount\` int DEFAULT 0,
      \`ratingAvg\` decimal(3,2) DEFAULT '0.00',
      \`ratingCount\` int DEFAULT 0,
      \`metaTitle\` varchar(70),
      \`metaDescription\` varchar(160),
      \`ogImageUrl\` varchar(500),
      \`forkedFromId\` varchar(255),
      \`createdAt\` timestamp DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp ON UPDATE CURRENT_TIMESTAMP,
      \`publishedAt\` timestamp,
      CONSTRAINT \`prompts_id\` PRIMARY KEY(\`id\`),
      CONSTRAINT \`prompts_slug_unique\` UNIQUE(\`slug\`),
      CONSTRAINT \`slug_idx\` UNIQUE(\`slug\`)
    )`)
    await conn.query("CREATE INDEX `userId_idx` ON `prompts` (`userId`)")
    await conn.query("CREATE INDEX `categoryId_idx` ON `prompts` (`categoryId`)")
    await conn.query("CREATE INDEX `search_idx` ON `prompts` (`title`,`description`(255))")
    console.log('Created prompts table and indexes')
  } else {
    console.log('prompts table already exists')
  }
  await conn.end()
}

ensure().catch((e) => { console.error(e); process.exit(1) })
