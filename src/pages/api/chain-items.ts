import { Fact, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';
import ObjectID from 'bson-objectid';
import { json } from 'stream/consumers';
//const { hasSome } = require('prisma-multi-tenant');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const {chainItemId, newTitle, newComment, chainItemToAdd, chainItemToRevome, chainItemIdsToSwap} = req.query;
    const session: ExtendedSession = await getServerSession(req, res, authOptions);
    try {
        const client = new PrismaClient();
        switch (method) {
            case 'GET':
                let prismaResult;
                // Get data from your database
                if (chainItemId) {
                    prismaResult = await client.factChainItem.findUnique({
                        where: { id: chainItemId as string },
                    });
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    } else {
                        res.status(404).json({ message: "Chaine non trouvée pour l'id " + chainItemId });
                    }
                } else {
                    prismaResult = await client.factChain.findMany();
                    if (prismaResult) {
                        res.status(200).json({ data: prismaResult });
                    } else {
                        res.status(404).json({ message: "Chaine non trouvée" });
                    }
                }
                break;
            case 'PATCH':
                {
                    // Update FactChain with provided fields
                    const updatedFactChainItem = await client.factChainItem.update({
                        where: { id: chainItemId as string },
                        data: {
                            ...(newTitle && { title: newTitle as string }),
                            ...(newComment && { comment: newComment as string }),
                        },
                    });

                    // Remove the specified FactChainItem and adjust positions
                    if (chainItemToRevome) {
                        const removedItem = await client.factChainItem.findUnique({
                            where: { id: chainItemToRevome as string },
                        });

                        await client.factChainItem.delete({
                            where: { id: chainItemToRevome as string },
                        });

                        if (removedItem) {
                            const positionToRemove = removedItem.position;
                            const factChainId = removedItem.factChainId;
                            const itemsToUpdate = await client.factChainItem.findMany({
                                where: {
                                    factChainId: factChainId,
                                    position: { gt: positionToRemove },
                                },
                            });

                            for (const item of itemsToUpdate) {
                                await client.factChainItem.update({
                                    where: { id: item.id },
                                    data: { position: item.position - 1 },
                                });
                            }
                        }
                    }else if(chainItemIdsToSwap){
                        const chainItemIdsToSwapArray = chainItemIdsToSwap as string[];
                        const chainItem1 = await client.factChainItem.findUnique({
                            where: { id: chainItemIdsToSwapArray[0] },
                        });
                        const chainItem2 = await client.factChainItem.findUnique({
                            where: { id: chainItemIdsToSwapArray[1] },
                        });
                        if (chainItem1 && chainItem2){
                            const position1 = chainItem1.position;
                            const position2 = chainItem2.position;
                            await client.factChainItem.update({
                                where: { id: chainItemIdsToSwapArray[0] },
                                data: { position: position2 },
                            });
                            await client.factChainItem.update({
                                where: { id: chainItemIdsToSwapArray[1] },
                                data: { position: position1 },
                            });
                        }
                    }
                    break;
                }
            case 'POST':
                // Create data in your database
                if (chainItemToAdd) {
                    // Add a new FactChainItem
                    const itemToAdd = JSON.parse(chainItemToAdd as string);
                    if(itemToAdd.factId && itemToAdd.factChainId){
                        const items = await client.factChainItem.findMany({
                            where: { factChainId: itemToAdd.factChainId},
                        });
                        const position = items.length;
                        const newFactChainItem = await client.factChainItem.create({
                            data: {
                                id: ObjectID().toHexString(),
                                title: itemToAdd.title || "",
                                position: position,
                                factChainId: itemToAdd.factChainId,
                                factId: itemToAdd.factId,
                                comment: itemToAdd.comment || "",
                            },
                        });
                        if(newFactChainItem){
                            res.status(200).json({ data: newFactChainItem });
                        }else{
                            res.status(500).json({ message: "Erreur serveur lors de la mise à jour partielle de la chaîne de faits et de l'ajout d'un élément" });
                        }
                    }else{
                        res.status(500).json({ message: "Certaines données obligatoires sont manquantes" });
                    }
                } else {
                    res.status(500).json({ message: "Aucune donnée à ajouter" });
                }
                break;
            case 'DELETE':
                if (chainItemId){
                    // Create data in your database
                    const deletedFactChain = await client.factChainItem.delete({
                        where: { id: chainItemId as string },
                    });
                    if (deletedFactChain) {
                        res.status(201).json({ data: deletedFactChain });
                    } else {
                        res.status(500).json({ message: "Erreur serveur sur la suppression d'une chaîne de faits" });
                    }
                }else{
                    res.status(500).json({ message: "Aucune donnée à supprimer" });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
        // close the database connection
        await client.$disconnect();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}