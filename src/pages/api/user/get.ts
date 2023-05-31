import type { NextApiRequest, NextApiResponse } from 'next'
import { exclude, prisma } from '../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "GET"){
        return;
    }

    const {id} = req.query;

    try{
        const prismaResult = await prisma.user.findUnique({
            where: {
                id: Array.isArray(id) ? id[0] : id
            }
        });
        
        return res.status(200).json({ data: exclude(prismaResult, ['password']) });
    }
    catch(err){
        return res.status(500).json(err);
    }
}

export default handler;
