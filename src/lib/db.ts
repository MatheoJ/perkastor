import { MongoClient } from 'mongodb';
import { PrismaClient } from '@prisma/client'

export async function connectToDatabase() {
	const client = await MongoClient.connect(process.env.DATABASE_URL!);
	return client;
}

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined
}

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query'],
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma