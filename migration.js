const { MongoClient } = require('mongodb');

const MONGO_URI = "mongodb+srv://antoninmarxer:5f3aac58ed65413a8072d625492ec401011eecbaafbc3e27a749e3dcf7ef4560@cluster0.a0nfhg5.mongodb.net/test"
console.log(MONGO_URI)
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
