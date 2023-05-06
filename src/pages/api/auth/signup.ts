import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
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
    const name: string = data?.name;
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

    const nameValidator = new RegExp('^[a-zA-Z0-9_-]*$');
    if (
        !name ||
        name.trim().length < 3 ||
        !nameValidator.test(name) // cf https://stackoverflow.com/questions/1221985/how-to-validate-a-user-name-with-regex
    ) {
        res.status(422).json({
            message:
                'Entrée invalide - Votre pseudonyme doit faire plus de 3 caractères, ne peut contenir que des caractères aplhanumériques ainsi que des \'_\', \'-\', \' \'.',
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

        const existingUser = await db.collection('users').findOne({ email: email }) || await db.collection('users').findOne({ name: name });

        if (existingUser) {
            res.status(422).json({ message: 'L\'utilisateur existe déjà !' });
            client.close();
            return;
        }

        const hashedPassword = await hashPassword(password);

        const result = await db.collection('users').insertOne({
            email: email,
            name: name,
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
