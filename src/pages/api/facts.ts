import { Fact, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req);
    const { method } = req;

    const { fid } = req.query; // fact id
    const { topLeft, bottomRight } = req.query;
    console.log(req.query)
    const session: ExtendedSession = await getServerSession(req, res, authOptions)

    try {
        const client = new PrismaClient();
        let prismaResult;
        switch (method) {
            case "GET":
                if (fid) {
                    prismaResult = await client.fact.findUnique({
                        where: {
                            id: Array.isArray(fid) ? fid[0] : fid
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                    } else {
                        res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    }
                } else if (topLeft && bottomRight) {
                    const [topLeftLat, topLeftLng] = (typeof topLeft === 'string' ? topLeft : topLeft[0]).split(',').map(parseFloat);
                    const [bottomRightLat, bottomRightLng] = (typeof bottomRight === 'string' ? bottomRight : bottomRight[0]).split(',').map(parseFloat);

            
                    if (isNaN(topLeftLat) || isNaN(topLeftLng) || isNaN(bottomRightLat) || isNaN(bottomRightLng)) {
                        res.status(422).json({ message: `Les coordonnées fournies sont invalides.` });
                        return;
                    }
                    // print attributes of LocationWhereInput
                    
                    prismaResult = await client.fact.findMany({
                        where: {
                          location: {
                            AND: [
                              {
                                latitude: {
                                  lte: topLeftLat,
                                  gte: bottomRightLat,
                                },
                              },
                              {
                                longitude: {
                                  gte: topLeftLng,
                                  lte: bottomRightLng,
                                },
                              },
                            ],
                          },
                        },
                      });
                      
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                } else {
                    prismaResult = await client.fact.findMany();
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                }
                break;
            case "POST":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!req.body.location) {
                    res.status(422).json({ message: `Le lieu n\'est pas renseigné.` });
                }

                let createLocation: boolean = false;
                let location;
                // search location by id
                if (req.body.location.id && req.body.location.id !== "") {
                    // Check if the fact's location exists
                    location = await client.location.findUnique({
                        where: {
                            id: req.body.location.id
                        },
                    });
                    if (!location) {
                        res.status(422).json({ message: `Le lieu n\'existe pas.` });
                        return;
                    }
                }
                // search location by [coordinates, name] pair
                else {
                    if (!req.body.location.latitude || !req.body.location.longitude) {
                        res.status(422).json({ message: `Les coordonnées du lieu ne sont pas renseignées.` });
                        return;
                    }
                    if (!req.body.location.name) {
                        res.status(422).json({ message: `Le nom du lieu n'est pas renseigné.` });
                        return;
                    }

                    location = await client.location.findFirst({
                        where: {
                            AND: [
                                {
                                    latitude: req.body.location.latitude
                                },
                                {
                                    longitude: req.body.location.longitude
                                },
                                {
                                    name: req.body.location.name
                                }
                            ]
                        },
                    });
                    if (!location) {
                        createLocation = true;
                    }
                }

                let locPayload;
                if (createLocation) {
                    locPayload = {
                        create: req.body.location
                    }
                } else {
                    locPayload = {
                        connect: {
                            id: location.id
                        }
                    }
                }

                // if the user is an admin, he can create a fact for another user
                if (session.user.role === "admin") {
                    if (!req.body.author) {
                        req.body.author = session.user.id;
                    } else {
                        // check if the author exists
                        const author = await client.user.findUnique({
                            where: {
                                id: req.body.author
                            }
                        });
                        if (!author) {
                            res.status(422).json({ message: `L'auteur n\'existe pas.` });
                            return;
                        }
                    }
                } else {
                    req.body.author = session.user.id;
                }

                // Create a new fact
                prismaResult = await client.fact.create({
                    data: {
                        title: req.body.title,
                        shortDesc: req.body.shortDesc,
                        content: req.body.content,
                        keyDates : req.body.keyDates || [],
                        bannerImg: req.body.bannerImg,
                        video: req.body.video || [],
                        audio: req.body.audio || [],
                        personsInvolved: req.body.personsInvolved || [],
                        author: req.body.author,
                        location: locPayload,
                        sources: req.body.sources || []
                    },
                });
                if (prismaResult) {
                    res.status(201).json({ statusCode: 201, data: prismaResult });
                } else {
                    res.status(422).json({ message: `Le fait historique n\'a pas pu être créé.` });
                }
                break;
            case "PUT": // used for partial modification of a resource

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                }
                // Check if the fact exists
                let fact = await client.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!fact) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }

                // if the user is an admin, he can create a fact for another user
                if (session.user.role === "admin") {
                    if (!req.body.author) {
                        req.body.author = session.user.id;
                    } else {
                        // check if the author exists
                        const author = await client.user.findUnique({
                            where: {
                                id: req.body.author
                            }
                        });
                        if (!author) {
                            res.status(422).json({ message: `L'auteur n\'existe pas.` });
                            return;
                        }
                    }
                } else {
                    req.body.author = session.user.id;
                }

                // the difference between http put and http patch is that put is idempotent
                // so we can't use put to update a fact, we have to use patch
                prismaResult = await client.fact.update({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                    data: {
                        title: req.body.title,
                        shortDesc: req.body.shortDesc,
                        content: req.body.content,
                        from: req.body.from,
                        until: req.body.until,
                        bannerImg: req.body.bannerImg,
                        video: req.body.video || [],
                        audio: req.body.audio || [],
                        personsInvolved: req.body.personsInvolved || [],
                        author: req.body.author,
                        location: locPayload,
                        sources: req.body.sources || []
                    },
                });

                if (prismaResult) {
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                } else {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'a pas pu être mis à jour.` });
                }
                break;
            case "PATCH":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                }
                // Check if the fact exists
                fact = await client.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!fact) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }
                // the difference between http put and http patch is that put is idempotent
                // so we can't use put to update a fact, we have to use patch
                let patchData = {}
                if (req.body.title) {
                    patchData["title"] = req.body.title
                }
                if (req.body.shortDesc) {
                    patchData["shortDesc"] = req.body.shortDesc
                }
                if (req.body.content) {
                    patchData["content"] = req.body.content
                }
                if (req.body.from) {
                    patchData["from"] = req.body.from
                }
                if (req.body.until) {
                    patchData["until"] = req.body.until
                }
                if (req.body.bannerImg) {
                    patchData["bannerImg"] = req.body.bannerImg
                }
                if (req.body.video) {
                    patchData["video"] = req.body.video
                }
                if (req.body.audio) {
                    patchData["audio"] = req.body.audio
                }
                if (req.body.personsInvolved) {
                    patchData["personsInvolved"] = req.body.personsInvolved
                }
                if (req.body.location) {
                    // check if the location exists
                    patchData["location"] = req.body.location
                }
                if (req.body.author && session.user.role === "admin") {
                    patchData["author"] = req.body.author
                }
                if (req.body.sources) {
                    patchData["sources"] = req.body.sources
                }
                prismaResult = await client.fact.update({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                    data: patchData,
                });

                if (res) {
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                } else {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'a pas pu être mis à jour.` });
                }

                break;
            case "DELETE":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                }
                // Check if the fact exists
                fact = await client.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!fact) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }

                // if the user is an admin, he can delete a fact for another user
                if (session.user.role === "admin" || session.user.id === fact.authorId) {
                    prismaResult = await client.fact.delete({
                        where: {
                            id: Array.isArray(fid) ? fid[0] : fid
                        },
                    });
                } else {
                    res.status(401).json({ message: 'Non autorisé !' });
                    return;
                }

                break;
            default:
                res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
                res.status(405).end(`Method ${method} Not Allowed`);
                return;
        }
        res.status(200).json(prismaResult);
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: JSON.stringify(error) });
    }
}
