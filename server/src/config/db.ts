import { PrismaClient } from '@prisma/client';

const environment = process.env.NODE_ENV || 'development';

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

export let prisma: PrismaClient;

if (environment === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.cachedPrisma) {
    globalThis.cachedPrisma = new PrismaClient();
  }
  prisma = globalThis.cachedPrisma;
}
