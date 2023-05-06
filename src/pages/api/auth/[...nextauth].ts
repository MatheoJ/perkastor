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
import ObjectID from 'bson-objectid';

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
    } else {
        userT = "user";
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
                    let user;
                    if (credentials.email) {
                        // find a user by email using prisma
                        user = await client.user.findUnique({
                            where: {
                                email: credentials.email,
                            },
                        });
                    } else if (credentials.username) {
                        // find a user by username using prisma
                        user = await client.user.findUnique({
                            where: {
                                username: credentials.username,
                            },
                        });
                    }

                    if (!user) {
                        throw new Error('Aucun utilisateur trouvé !');
                    }

                    const isValid = await verifyPassword(
                        credentials?.password!,
                        user.password
                    );

                    if (!isValid) {
                        throw new Error('Impossible de vous connecter. Veuillez vérifier votre mot de passe !');
                    }

                    return { email: user.email! };

                },
            }),
        ],
        callbacks: {
            async signIn({ user, account, profile, email, credentials }) {
                console.log("Check if the user already exists in the database");
                userData = await client.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                })
                if (userData) {
                    console.log("User already exists in the database")
                    return true;
                }
                console.log("User doesn't exist in the database");
                // register the user
                try {
                    userData = await client.user.create({
                        data: {
                            id: ObjectID().toHexString(),
                            fullName: profile.name,
                            email: profile.email,
                            active: true,
                            image: profile.image,
                            provider: account.provider,
                            role: userT,
                        }
                    })
                    console.log("user created successfully: " + userData)
                    return true;
                } catch (error) {
                    console.log(
                        "ERROR While adding new User from Google SignIn callback: " + error
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