import { type NextApiRequest, type NextApiResponse } from 'next';
import { exclude, prisma } from '../../lib/db'

//const { hasSome } = require('prisma-multi-tenant');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { id } = req.query;
   
    try {
        switch (method) {
            case 'GET':
                const prismaPrismaResult = await prisma.user.findUnique({
                    where: {
                        id: Array.isArray(id) ? id[0] : id,
                    },
                    include: {
                        facts: true,
                        factChains: true,
                    }
                });
                

                return res.status(200).json(exclude(prismaPrismaResult, ['password']));

            case 'POST':
                break;
        }
    } catch (error) {
        console.error("Error in /api/users.ts when receiving a " + method + " request:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
