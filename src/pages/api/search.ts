import { Fact, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession, SearchFilters } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';
import ObjectID from 'bson-objectid';
//const { hasSome } = require('prisma-multi-tenant');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { query, filtersParam } = req.query;
    let filters: SearchFilters;
    try {
        filters = JSON.parse(filtersParam as string);
    } catch (error) {
        filters = {
            event: true,
            anecdote: true,
            chain: true,
            historicalFigure: true,
            location: true,
            user: true
        }
    }
    console.log(req.query)


    
    
}