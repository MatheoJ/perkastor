import { hashPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message: string
}
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== 'POST') {
        return;
    }

    const data = req.body;

    const email: string = data?.email;
    const password: string = data?.password;

    if (
        !email ||
        !email.includes('@')
    ) {
        res.status(422).json({
            message:
                'Entrée invalide - Votre email doit contenir une @.',
        });
        return;
    }

    if (
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
            message:
                'Entrée invalide - Votre mot de passe doit faire plus de 7 caractères.',
        });
        return;
    }

    try {
        const client = await connectToDatabase();

        const db = client.db();

        const existingUser = await db.collection('users').findOne({ email: email });

        if (existingUser) {
            res.status(422).json({ message: 'L\'utilisateur existe déjà !' });
            client.close();
            return;
        }

        const hashedPassword = await hashPassword(password);

        const result = await db.collection('users').insertOne({
            email: email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Utilisateur crée !' });
        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Impossible de se connecter à la base de données !' });
        return;
    }

}

export default handler;
