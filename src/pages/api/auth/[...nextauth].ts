import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        /*
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        */
        CredentialsProvider({
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
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session['accessToken'] = token.accessToken
            return session
        }
    }
}

export default NextAuth(authOptions);