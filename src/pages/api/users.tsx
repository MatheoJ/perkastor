import { Fact, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession, SearchFilters, SearchResult } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';
import ObjectID from 'bson-objectid';
import { prisma } from '~/server/db';
import { bool } from 'aws-sdk/clients/signer';
//const { hasSome } = require('prisma-multi-tenant');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { id } = req.query;
   
    try {
        const client = new PrismaClient();
        switch (method) {
            case 'GET':
                const clientPrismaResult = await client.user.findUnique({
                    where: {
                        id: id
                    },
                    include: {
                        facts: true,
                        factChains: true,
                    }
                });

                return res.status(200).json(clientPrismaResult);

            case 'POST':
                break;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
    }
}
