import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {

    // check if the user is logged in

    // use getServerSession instead of getSession to avoid an extra fetch to an API route
    // if we didn't need the user info (here its email), we could just use getToken
    const session = await getServerSession(req, res, authOptions)

    res.status(200).json({ data: session });
}

export default handler;
