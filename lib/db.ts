import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
	const client = await MongoClient.connect(process.env.DATABASE_URL!);

	return client;
}