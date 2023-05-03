import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

type Awaitable<T> = T | PromiseLike<T>;

export default NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Identifiants",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                username: { label: "Nom d'utilisateur", type: "text", placeholder: "Nom d'utilisateur" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials, req) {
                let client;
                try {
                    client = await connectToDatabase();
                } catch (error) {
                    console.log("Impossible de se connecter à la base de données: ");
                    console.log(error);
                    throw new Error('Impossible de se connecter à la base de données !');
                }

                const usersCollection = client.db().collection('users');
                let user;
                if (credentials.email) {
                    user = await usersCollection.findOne({
                        email: credentials.email,
                    });
                } else if (credentials.username) {
                    user = await usersCollection.findOne({
                        username: credentials.username,
                    });
                }

                if (!user) {
                    client.close();
                    throw new Error('Aucun utilisateur trouvé !');
                }

                const isValid = await verifyPassword(
                    credentials?.password!,
                    user.password
                );

                if (!isValid) {
                    client.close();
                    throw new Error('Impossible de vous connecter. Veuillez vérifier votre mot de passe !');
                }

                client.close();

                return { email: user.email! };

            },
        }),
    ],
});