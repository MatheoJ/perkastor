import { HistoricalPerson, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req);
    const { method } = req;

    const { id } = req.query; // historical person id
    const { name } = req.query; // historical person name
    const { date } = req.query; // historical person date comprise between birth date and death date
    const { birthDate, deathDate } = req.query; // historical person dates
    console.log(req.query)
    const session: ExtendedSession = await getServerSession(req, res, authOptions)

    try {
        const client = new PrismaClient();
        let prismaResult;
        switch (method) {
            case "GET":
                if (id) {
                    prismaResult = await client.historicalPerson.findUnique({
                        where: {
                            id: Array.isArray(id) ? id[0] : id
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique d'id ${id} n\'existe pas.` });
                    }
                } else if (name && !date && !birthDate && !deathDate) {
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            name: {
                                contains: Array.isArray(name) ? name[0] : name,
                            }
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de nom ${name} n\'existe pas.` });
                    }
                } else if (name && date) {
                    var dateToCompare = new Date(Array.isArray(date) ? date[0] : date);
                    // Set the time to noon in UTC
                    dateToCompare.setHours(12, 0, 0, 0);
                    dateToCompare = new Date(dateToCompare.toISOString().split('T')[0]);
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            AND: [
                                {
                                    name: {
                                        contains: Array.isArray(name) ? name[0] : name,
                                    }
                                },
                                {
                                    birthDate: {
                                        lte: dateToCompare,
                                    },
                                },
                                {
                                    deathDate: {
                                        gte: dateToCompare,
                                    },
                                },
                            ],
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    }else{
                        res.status(422).json({ message: `Le personnage historique de nom ${name} ayant vécu cette année là ${date} n\'existe pas.` });
                    }
                } else if (name && birthDate && !deathDate) {
                    var fBirthDate = new Date(Array.isArray(birthDate) ? birthDate[0] : birthDate);
                    // Set the time to noon in UTC
                    fBirthDate.setHours(12, 0, 0, 0);
                    var fBirthDate = new Date(fBirthDate.toISOString().split('T')[0]);
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            AND: [
                                {
                                    name: {
                                        contains: Array.isArray(name) ? name[0] : name,
                                    }
                                },
                                {
                                    birthDate: fBirthDate,
                                },
                            ],
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de nom ${name} de date de naissance ${fBirthDate} n\'existe pas.` });
                    }
                } else if (name && !birthDate && deathDate) {
                    var fDeathDate = new Date(Array.isArray(deathDate) ? deathDate[0] : deathDate);
                    // Set the time to noon in UTC
                    fDeathDate.setHours(12, 0, 0, 0);
                    var fDeathDate = new Date(fDeathDate.toISOString().split('T')[0]);
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            AND: [
                                {
                                    name: {
                                        contains: Array.isArray(name) ? name[0] : name,
                                    }
                                },
                                {
                                    deathDate: fDeathDate,
                                },
                            ],
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de nom ${name} de date de mort ${fDeathDate} n\'existe pas.` });
                    }
                }
                else if (name && birthDate && deathDate) {
                    var fDeathDate = new Date(Array.isArray(deathDate) ? deathDate[0] : deathDate);
                    // Set the time to noon in UTC
                    fDeathDate.setHours(12, 0, 0, 0);
                    var fDeathDate = new Date(fDeathDate.toISOString().split('T')[0]);
                    var fBirthDate = new Date(Array.isArray(birthDate) ? birthDate[0] : birthDate);
                    // Set the time to noon in UTC
                    fBirthDate.setHours(12, 0, 0, 0);
                    var fBirthDate = new Date(fBirthDate.toISOString().split('T')[0]);

                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            AND: [
                                {
                                    name: {
                                        contains: Array.isArray(name) ? name[0] : name,
                                    }
                                },
                                {
                                    birthDate: fBirthDate,
                                },
                                {
                                    deathDate: fDeathDate,
                                },
                            ],
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de nom ${name} de date de naissance ${birthDate} et de date de mort ${deathDate} n\'existe pas.` });
                    }
                } else if (date && !name && !birthDate && !deathDate) {
                    var dateToCompare = new Date(Array.isArray(date) ? date[0] : date);
                    // Set the time to noon in UTC
                    dateToCompare.setHours(12, 0, 0, 0);
                    dateToCompare = new Date(dateToCompare.toISOString().split('T')[0]);

                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            AND: [
                                {
                                    birthDate: {
                                        lte:  dateToCompare,
                                    },
                                },
                                {
                                    deathDate: {
                                        gte: dateToCompare,
                                    },
                                },
                            ],
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de ayant vécu cette année là ${date} n\'existe pas.` });
                    }
                } else if (birthDate && deathDate && !date) {     
                    var fDeathDate = new Date(Array.isArray(deathDate) ? deathDate[0] : deathDate);
                    // Set the time to noon in UTC
                    fDeathDate.setHours(12, 0, 0, 0);
                    var fDeathDate = new Date(fDeathDate.toISOString().split('T')[0]);
                    console.log(fDeathDate);
                    var fBirthDate = new Date(Array.isArray(birthDate) ? birthDate[0] : birthDate);
                    // Set the time to noon in UTC
                    fBirthDate.setHours(12, 0, 0, 0);
                    var fBirthDate = new Date(fBirthDate.toISOString().split('T')[0]);
                    console.log(fBirthDate);
                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            birthDate: fBirthDate,
                            deathDate: fDeathDate,
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de date de naissance ${birthDate} et de date de mort ${deathDate} n\'existe pas.` });
                    }
                } else if (birthDate && !deathDate && !date){
                    var fBirthDate = new Date(Array.isArray(birthDate) ? birthDate[0] : birthDate);
                    // Set the time to noon in UTC
                    fBirthDate.setHours(12, 0, 0, 0);
                    var fBirthDate = new Date(fBirthDate.toISOString().split('T')[0]);

                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            birthDate: fBirthDate,
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de date de naissance ${birthDate} n\'existe pas.` });
                    }
                } else if (deathDate && !birthDate && !date){
                    var fDeathDate = new Date(Array.isArray(deathDate) ? deathDate[0] : deathDate);
                    // Set the time to noon in UTC
                    fDeathDate.setHours(12, 0, 0, 0);
                    var fDeathDate = new Date(fDeathDate.toISOString().split('T')[0]);

                    prismaResult = await client.historicalPerson.findMany({
                        where: {
                            deathDate: fDeathDate,
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le personnage historique de date de mort ${deathDate} n\'existe pas.` });
                    }
                }
                  else {
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