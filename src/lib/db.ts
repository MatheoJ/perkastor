import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined
}
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
	
// Exclude keys from user
export function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
): Omit<User, Key> {
	for (const key of keys) {
		delete user[key]
	}
	return user
}