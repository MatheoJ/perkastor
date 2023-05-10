import { connectToDatabase } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "GET"){
        return;
    }

    const {id} = req.query;
    console.log(id);

    try{
        const client: PrismaClient = new PrismaClient();
        const prismaResult = await client.user.findUnique({
            where: {
                id: Array.isArray(id) ? id[0] : id
            }
        });

        console.log(prismaResult)

        return res.status(200).json({ data: prismaResult });
    }
    catch(err){
        return res.status(500).json(err);
    }
}

export default handler;
