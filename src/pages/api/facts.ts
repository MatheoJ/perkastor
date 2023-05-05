import { connectToDatabase } from '../../lib/db';

export async function handler(req, res) {
    const { method } = req;

    const { fid } = req.query; // fact id

    try {
        const client = await connectToDatabase();

        const db = client.db();

        let res;
        switch (method) {
            case "GET":
                if (fid) {
                    res = await db.collection('facts').findOne({ id: fid });
                    if (res) {
                        res.status(422).json({ message: 'L\'utilisateur existe déjà !' });
                    }
                } else {
                    res = await db.collection('facts').find().toArray();
                }
                break;
            case "POST":
                break;
            case "PUT":
                break;
            case "DELETE":
                break;
            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
                res.status(405).end(`Method ${method} Not Allowed`);
                return;
        }
        client.close();
        res.status(200).json(res);
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: 'Impossible de se connecter à la base de données !' });
    }
}