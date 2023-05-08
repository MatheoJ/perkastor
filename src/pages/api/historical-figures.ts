import { HistoricalPerson, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req);
    const { method } = req;

    const { fid } = req.query; // historical person id
    const { fname } = req.query; // historical person name
    const { fbirthDate, fdeathDate } = req.query; // historical person dates
    console.log(req.query)
    const session: ExtendedSession = await getServerSession(req, res, authOptions)

    try {
        const client = new PrismaClient();
        let prismaResult;
        switch (method) {
            case "GET":
                if (fid) {
                    prismaResult = await client.historicalPerson.findUnique({
                        where: {
                            id: Array.isArray(fid) ? fid[0] : fid
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique d'id ${fid} n\'existe pas.` });
                    }
                } else if (fname) {
                    prismaResult = await client.historicalPerson.findUnique({
                        where: {
                            name: Array.isArray(fname) ? fname[0] : fname
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de nom ${fname} n\'existe pas.` });
                    }
                } else if (fbirthDate && fdeathDate) {                    
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            birthDate: Array.isArray(fbirthDate) ? fbirthDate[0] : fbirthDate+"T00:00:00.000Z",
                            deathDate: Array.isArray(fdeathDate) ? fdeathDate[0] : fdeathDate+"T00:00:00.000Z"
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de date de naissance ${fbirthDate} et de date de mort ${fdeathDate} n\'existe pas.` });
                    }
                }  else {
                    prismaResult = await client.historicalPerson.findMany();
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                }
                break;
            default:
                res.setHeader("Allow", ["GET"]);
                res.status(405).end(`Method ${method} Not Allowed`);
                return;
        }
        res.status(200).json(prismaResult);
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: JSON.stringify(error) });
    }
}
