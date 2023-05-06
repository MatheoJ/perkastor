import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import TwitterProvider from "next-auth/providers/twitter"
import DiscordProvider from "next-auth/providers/discord"

import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Prisma, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next/types';

const GOOGLE_AUTHORIZATION_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
    })

// An Adapter in NextAuth.js connects your application to whatever database or backend system you want to use to store data for users, their accounts, sessions, etc.
const client = new PrismaClient();
const prismaAdapter = PrismaAdapter(client);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            })

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

let userT = "";
let userData = {};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // Do whatever you want here, before the request is passed down to `NextAuth`

    // save user data only if not undefined, so it doesn't overwrite
    if (req.body.userType !== undefined) {
        userT = req.body.userType;
    }

    return await NextAuth(req, res, {
        adapter: prismaAdapter,
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
            GithubProvider({
                clientId: process.env.GITHUB_CLIENT_ID!,
                clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                authorization: {
                    params: {
                        access_type: "offline",
                        prompt: "consent",
                        response_type: "code",
                        userType: "user" || "admin",
                    },
                }
            }),
            FacebookProvider({
                clientId: process.env.FACEBOOK_CLIENT_ID!,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            }),
            TwitterProvider({
                clientId: process.env.TWITTER_CLIENT_ID!,
                clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            }),
            DiscordProvider({
                clientId: process.env.DISCORD_CLIENT_ID!,
                clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            }),
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
            async signIn({ user, account, profile, email, credentials }) {
                userData = await client.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                })
                if (userData) {
                    return true;
                }
                // register the user
                try {
                    userData = await client.user.create({
                        data: {
                            fullName: profile.name,
                            email: profile.email,
                            active: true,
                            image: profile.image,
                            provider: account.provider,
                            id: "",
                            role: userT,
                        }
                    })
                    return true;
                } catch (error) {
                    console.log(
                        "ERROR While adding new User from Google SignIn callback"
                    );
                    return false;
                }
            },
            async jwt({ token, user, account, profile }) {
                // Persist the OAuth access_token to the token right after signin
                if (user) {
                    token.id = user.id;
                }
                if (account) {
                    token.accessToken = account.access_token
                    token.refreshToken = account.refresh_token
                }
                token.accessTokenExpires = Date.now() + Number(account.expires_in) * 1000

                // Return previous token if the access token has not expired yet
                if (Date.now() < Number(token.accessTokenExpires)) {
                    return token
                }

                return refreshAccessToken(token)
            },
            async session({ session, token, user }) {
                const getToken = await client.account.findFirst({
                    where: {
                        userId: user.id,
                    },
                });

                let accessToken: string | null = null;
                if (getToken) {
                    accessToken = getToken.access_token!;
                }

                session.user.token = accessToken;

                return session;
            },
        }
    });
}