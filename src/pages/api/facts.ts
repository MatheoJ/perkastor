import { PrismaClient } from '@prisma/client';
import { connectToDatabase } from '../../lib/db';

export async function handler(req, res) {
    const { method } = req;

    const { fid } = req.query; // fact id

    try {
        const client = new PrismaClient();
        let res;
        switch (method) {
            case "GET":
                if (fid) {
                    res = await client.fact.findUnique({
                        where: {
                            id: fid
                        },
                    });
                    if (res) {
                        res.status(200).json({ statusCode: 200, data: res });
                    } else {
                        res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    }
                } else {
                    res = await client.fact.findMany();
                    res.status(200).json({ statusCode: 200, data: res });
                }
                break;
            case "POST":
                // Create a new fact
                /*
                res = await client.fact.create({
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        date: req.body.date,
                        image: req.body.image,
                        link: req.body.link,
                        type: req.body.type,
                        user: {
                            connect: { id: req.body.userId }
                        }
                    },
                });
                if (res) {
                    res.status(201).json({ statusCode: 201, data: res });
                } else {
                    res.status(422).json({ message: `Le fait historique n\'a pas pu être créé.` });
                }
                */
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