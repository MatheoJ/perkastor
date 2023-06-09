import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { type ExtendedSession } from 'types/types';
import { authOptions } from './auth/[...nextauth]';
import ObjectID from 'bson-objectid';
import { prisma } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { userId, chainId, locationId } = req.query;

    const session: ExtendedSession = await getServerSession(req, res, authOptions)
    try {
        switch (method) {
            case 'GET': {
                let prismaResult;
                // Get data from your database
                if (chainId) {
                    prismaResult = await prisma.factChain.findUnique({
                        where: { id: chainId as string },
                        include: {
                            items: {
                                include: {
                                    fact: {
                                        include: {
                                            location: true,
                                            personsInvolved: true,
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                        break;
                    }
                    res.status(404).json({ message: "Chaine non trouvée pour l'id " + chainId });
                } else if (userId) {
                    const prismaResult = await prisma.factChain.findMany({
                        where: {
                            authorId: userId as string
                        },
                        //include items and facts in items
                        include: {
                            items: {
                                include: {
                                    fact: {
                                        include: {
                                            location: true,
                                            personsInvolved: true,
                                        }
                                    }
                                }
                            },
                            author: true
                        }
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                        break;
                    }
                    res.status(404).json({ message: `Chaine non trouvée pour l'utilisateur ${userId}` });
                } else if (locationId && locationId !== "null") {
                    const prismaResult = await prisma.factChain.findMany({
                        where: {
                            items: {
                                some: {
                                    fact: {
                                        locationId: locationId as string
                                    }
                                }
                            }
                        },
                        //include items and facts in items
                        include: {
                            items: {
                                include: {
                                    fact: {
                                        include: {
                                            location: true,
                                            personsInvolved: true,
                                        }
                                    }
                                }
                            },
                            author: true
                        }
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                        break;
                    }
                    res.status(404).json({ message: `Chaine non trouvée pour la localisation ${locationId}` });
                } else {
                    prismaResult = await prisma.factChain.findMany(
                        {
                            include: {
                                items: {
                                    include: {
                                        fact: {
                                            include: {
                                                location: true,
                                                personsInvolved: true,
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                        break;
                    }
                    res.status(404).json({ message: "Chaine non trouvée" });
                }
            }
            break;
            case 'POST': {
                // Create data in your database
                const { title, description, factItems, authorId } =req.body;
                const factChainId = ObjectID().toHexString();
                
                await prisma.factChain.create({
                    data: {
                        id: factChainId,
                        title: title,
                        author : {
                            connect : {
                                id : authorId || session.user.id
                            }
                        },
                        description: description,
                    },
                });
                let i = 0;
                const factIds: string[] = [];
                for (const factItem of factItems) {
                    const factItemId = ObjectID().toHexString();
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
                    break;
                }
                res.status(500).json({ message: "Erreur serveur sur l'ajout d'une chaîne de faits" });
                
            }
            break;
            case 'PUT':
                {
                    const { title, description, factItems } = req.body;

                    // Update FactChain
                    await prisma.factChain.update({
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
                        break;
                    }
                    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la chaîne de faits" });
                }
                break;
            case 'PATCH':
                {
                    const { title, description, chainId } = req.body;

                    // Update FactChain with provided fields
                    await prisma.factChain.update({
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
                        break;
                    }
                    res.status(500).json({ message: "Erreur serveur lors de la mise à jour partielle de la chaîne de faits et de la suppression d'un élément" });
                }
            case 'DELETE':
                // Create data in your database
                const { id } = req.query;
                
                const deletedFactChain = await prisma.factChain.delete({
                    where: { id: id as string },
                });
                if (deletedFactChain) {
                    res.status(201).json({ data: deletedFactChain });
                    break;
                }
                res.status(500).json({ message: "Erreur serveur sur la suppression d'une chaîne de faits" });
            default:
                res.status(405).end(`Method ${method} Not Allowed`);
                break;
        }
    }
    catch (error) {
        console.error("Error in /api/chains.ts when receiving a " + method + " request:", error);
        res.status(500).json({ message: error });
        return;
    }
}