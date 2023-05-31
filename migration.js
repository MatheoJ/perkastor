const { MongoClient } = require('mongodb');

const DATABASE_NAME = 'test'; // Remplacez par le nom de votre base de données

async function migrateCoordinates() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const locationsCollection = db.collection('locations');

    const locations = await locationsCollection.find({}).toArray();

    for (const location of locations) {
        const [longitude, latitude] = location.coordinates;
        await locationsCollection.updateOne(
            { _id: location._id },
            {
                $set: {
                    latitude: latitude,
                    longitude: longitude,
                },
                $unset: {
                    coordinates: '',
                },
            }
        );
    }

    await client.close();
}

migrateCoordinates()
    .then(() => console.log('Migration réussie.'))
    .catch((error) => console.error('Erreur lors de la migration :', error));
