// mongodb.js

import { MongoClient, type MongoClientOptions } from 'mongodb'


export async function connectToDatabase() {
	const client = await MongoClient.connect(process.env.DATABASE_URL!);
	return client;
}

const uri = process.env.DATABASE_URL
const options: MongoClientOptions = {
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.DATABASE_URL) {
    throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise