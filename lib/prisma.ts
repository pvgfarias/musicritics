import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js environments to handle Neon WebSocket pooling
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

// 1. Pass the connection string directly into PrismaNeon to fix the Pool mismatch error
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// 2. Safely initialize PrismaClient with the adapter configuration
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
