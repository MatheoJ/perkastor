import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { authOptions } from './auth/[...nextauth]';
import ObjectID from 'bson-objectid';
import { prisma } from '../../lib/db'
//const { hasSome } = require('prisma-multi-tenant');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { userId, chainId, locationId } = req.query;
    console.log(req.query)
    const session: ExtendedSession = await getServerSession(req, res, authOptions)
    try {
        switch (method) {
            case 'GET':
                let prismaResult;
                // Get data from your database
                if (chainId) {
                    prismaResult = await prisma.factChain.findUnique({
                        where: { id: chainId as string },
                        include: { items: true },
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    } else {
                        res.status(404).json({ message: "Chaine non trouvée pour l'id " + chainId });
                    }
                } else if (userId) {
                    prismaResult = await prisma.factChain.findMany({
                        where: { authorId: userId as string },
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    } else {
                        res.status(404).json({ message: `Chaine non trouvée pour l'utilisateur ${userId}` });
                    }
                } else if (locationId) {
                    const prismaResult = await prisma.factChain.findMany({
                        where: {
                          items: {
                            some: {
                              fact: {
                                locationId: locationId as string
                              }
                            }
                          }
                        }
                      });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    }
                    else {
                        res.status(404).json({ message: `Chaine non trouvée pour la localisation ${locationId}` });
                    }
                } else {
                    prismaResult = await prisma.factChain.findMany();
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    } else {
                        res.status(404).json({ message: "Chaine non trouvée" });
                    }
                }
                break;
            case 'POST':
                // Create data in your database
                const { title, description, factItems, authorId } = req.body;
                var factChainId = ObjectID().toHexString();
                const newFactChain = await prisma.factChain.create({
                    data: {
                        id: factChainId,
                        title: title,
                        authorId: session.user.id || authorId,
                        description: description,
                    },
                });
                let i = 0;
                let factIds: string[] = [];
                for (const factItem of factItems) {
                    var factItemId = ObjectID().toHexString();
                    factIds.push(factItemId);
                    await prisma.factChainItem.create({
                        data: {
                            id: factItemId,
                            factId: factItem.factId as string,
                            factChainId: factChainId,
                            title: factItem.title as string,
                            comment: factItem.comment as string,
                            position: i++,
                        },
                    });
                }
                await prisma.factChain.update({
                    where: { id: factChainId },
                    data: {
                        items: {
                            connect: factIds.map((id) => ({ id })),
                        },
                    },
                });

                const updatedFactChain = await prisma.factChain.findUnique({
                    where: { id: factChainId },
                    include: { items: true },
                });

                if (updatedFactChain) {
                    res.status(201).json({ data: updatedFactChain });
                } else {
                    res.status(500).json({ message: "Erreur serveur sur l'ajout d'une chaîne de faits" });
                }
                break;
            case 'PUT':
                {
                    const { title, description, factItems } = req.body;

                    // Update FactChain
                    const updatedFactChainResult = await prisma.factChain.update({
                        where: { id: chainId as string },
                        data: {
                            title: title,
                            description: description,
                        },
                    });

                    // Remove existing FactChainItems
                    await prisma.factChainItem.deleteMany({
                        where: { factChainId: chainId as string },
                    });

                    // Create new FactChainItems
                    let i = 0;
                    for (const factItem of factItems) {
                        await prisma.factChainItem.create({
                            data: {
                                factId: factItem.factId as string,
                                factChainId: chainId as string,
                                title: factItem.title as string,
                                comment: factItem.comment as string,
                                position: i++,
                            },
                        });
                    }

                    // Get the updated FactChain with new items
                    const result = await prisma.factChain.findUnique({
                        where: { id: chainId as string },
                        include: { items: true },
                    });

                    if (result) {
                        res.status(200).json({ data: result });
                    } else {
                        res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la chaîne de faits" });
                    }
                    break;
                }
            case 'PATCH':
                {
                    const { title, description, chainId} = req.body;

                    // Update FactChain with provided fields
                    const updatedFactChain = await prisma.factChain.update({
                        where: { id: chainId as string },
                        data: {
                            ...(title && { title: title }),
                            ...(description && { description: description }),
                        },
                    });
                    
                    // Get the updated FactChain with items
                    const result = await prisma.factChain.findUnique({
                        where: { id: chainId as string },
                        include: { items: true },
                    });

                    if (result) {
                        res.status(200).json({ data: result });
                    } else {
                        res.status(500).json({ message: "Erreur serveur lors de la mise à jour partielle de la chaîne de faits et de la suppression d'un élément" });
                    }
                    break;
                }
            case 'DELETE':
                // Create data in your database
                const { id } = req.query;
                console.log(id);
                const deletedFactChain = await prisma.factChain.delete({
                    where: { id: id as string },
                });
                if (deletedFactChain) {
                    res.status(201).json({ data: deletedFactChain });
                } else {
                    res.status(500).json({ message: "Erreur serveur sur la suppression d'une chaîne de faits" });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}