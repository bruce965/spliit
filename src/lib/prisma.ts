import * as postgresql from '../../.prisma/client/postgresql'
import { Prisma as PostgresqlPrisma, PrismaClient as PostgresqlPrismaClient } from '../../.prisma/client/postgresql'
import * as sqlite from '../../.prisma/client/sqlite'
import { Prisma as SqlitePrisma, PrismaClient as SqlitePrismaClient } from '../../.prisma/client/sqlite'

const { PrismaClient: _sqliteClient, Prisma: _sqlitePrisma, ...sqliteTypes } = sqlite
const { PrismaClient: _postgresqlClient, Prisma: _postgresqlPrisma, ...postgresqlTypes } = postgresql

// Statically ensure that 'sqliteTypes' and 'postgresqlTypes' are actually the same type.
const _1: typeof postgresqlTypes = sqliteTypes
const _2: typeof sqliteTypes = postgresqlTypes

type Prisma = typeof PostgresqlPrisma | typeof SqlitePrisma
const Prisma = (
  process.env['DATABASE_PROVIDER'] === 'postgresql' ? PostgresqlPrisma :
  process.env['DATABASE_PROVIDER'] === 'sqlite' ? SqlitePrisma :
  undefined as never
)

type PrismaClient = PostgresqlPrismaClient | SqlitePrismaClient
const PrismaClient = (
  process.env['DATABASE_PROVIDER'] === 'postgresql' ? PostgresqlPrismaClient :
  process.env['DATABASE_PROVIDER'] === 'sqlite' ? SqlitePrismaClient :
  undefined as never
)

declare const global: Global & { prisma?: PrismaClient }

export let p: PrismaClient = undefined as any as PrismaClient

if (typeof window === 'undefined') {
  // await delay(1000)
  if (process.env['NODE_ENV'] === 'production') {
    p = new PrismaClient()
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        // log: [{ emit: 'stdout', level: 'query' }],
      })
    }
    p = global.prisma
  }
}

export const prisma = p

export { Prisma, PrismaClient }

// Export everything else from any of the clients (they are the same anyways).
// Note: previous exports take precedence, they are not overridden.
export * from '../../.prisma/client/postgresql'
