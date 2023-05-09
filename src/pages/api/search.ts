import { Fact, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { connectToDatabase } from '../../lib/db';
import { authOptions } from './auth/[...nextauth]';
//const { hasSome } = require('prisma-multi-tenant');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const query = req.query.query;
    const session: ExtendedSession = await getServerSession(req, res, authOptions)
    const {name,}
    try {
        const client = new PrismaClient();
        let prismaResult;
        switch (method) {
            case