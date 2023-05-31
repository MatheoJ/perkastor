import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import TwitterProvider from "next-auth/providers/twitter"
import DiscordProvider from "next-auth/providers/discord"
import ObjectID from 'bson-objectid';
// Modules needed to support key generation, token encryption, and HTTP cookie manipulation 
import { randomUUID } from 'crypto'
import Cookies from 'cookies'
import { encode, decode } from 'next-auth/jwt'

import { verifyPassword } from '../../../lib/auth';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type NextApiRequest, type NextApiResponse } from 'next/types';
import { prisma } from '../../../lib/db'

// calculate the maxAge for a cookie from a expiresIn value in seconds
const fromDate = (time: number, date = Date.now()) => {
    return new Date(date + time * 1000)
}

// An Adapter in NextAuth.js connects your application to whatever database or backend system you want to use to store data for users, their accounts, sessions, etc.
const prismaAdapter = PrismaAdapter(prisma);

// Helper functions to generate unique keys and calculate the expiry dates for session cookies
const generateSessionToken = () => {
    // Use `randomUUID` if available. (Node 15.6++)
    return randomUUID?.() || ObjectID().toHexString();
}



/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
    if (token.refreshToken === undefined) {
        return token
    }
    try {
        const url =
            "https://oauth2.googleapis.com/token?" +
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }).toString()

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
        console.error("Couldn't refresh Google authentication token: ", error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

// let userT = "user";
// let userData = {};

export const authOptions: NextAuthOptions = {
    adapter: prismaAdapter,
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth',
    },
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
            // e.g. domain, name, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                name: { label: "Nom d'utilisateur", type: "text", placeholder: "Nom d'utilisateur" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials, req) {
                let user;
                if (credentials.email) {
                    // find a user by email using prisma
                    user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });
                } else if (credentials.name) {
                    // find a user by name using prisma
                    user = await prisma.user.findUnique({
                        where: {
                            name: credentials.name,
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

                return { email: user.email!, id: user.id! };

            },
        }),
    ],
    callbacks: {
        redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async jwt({ token, user, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            // if (user) {
            //     token.id = user.id;
            // }
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
            }
            if (user) {
                token.uid = user.id;
                // check if the user's role is defined
                token.role = user['role'] || "user";
            }
            token.accessTokenExpires = Number(account?.exp || account?.expires_at) * 1000

            // Return previous token if the access token has not expired yet
            if (Date.now() < Number(token.accessTokenExpires)) {
                return token
            }

            return refreshAccessToken(token)
        },
        async session({ session, token, user }) {
            if (session?.user) {
                session.user.id = user.id;
                session.user['role'] = user['role'] as string;
                session.user.emailVerified = user?.emailVerified;
                session.user.firstName = user['firstName'] as string;
                session.user.lastName = user['lastName'] as string;
                session.user.image = user?.image;
                session.user.fullName = user['fullName'] as string;
            }
            return session;
        },
    }
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    authOptions.callbacks.signIn = async ({ user, account, profile, email, credentials }) => {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (req.query.nextauth.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
            if (user) {
                const sessionToken = generateSessionToken()
                const sessionExpiry = fromDate(authOptions.session.maxAge)

                const session = await prisma.session.create({
                    data: {
                        id: ObjectID().toHexString(),
                        sessionToken: sessionToken,
                        userId: user.id,
                        expires: sessionExpiry
                    }
                })


                const cookies = new Cookies(req, res)

                cookies.set('next-auth.session-token', session.sessionToken, {
                    Expires: session.expires, SameSite: 'Lax', HttpOnly: true, Path: '/'
                })

                res.setHeader('Set-Cookie', [`next-auth.session-token=${session.sessionToken}; Path=/; Expires=${session.expires}; HttpOnly; SameSite=Lax`])
            }
        }
        return true;
    }

    // Customize the JWT encode and decode functions to overwrite the default behaviour of storing the JWT token in the session  cookie when using credentials providers. Instead we will store the session token reference to the session in the database.
    authOptions.callbacks.jwt['encode'] = async (token, secret, maxAge) => {
        if (req.query.nextauth.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
            const cookies = new Cookies(req, res)

            const cookie = cookies.get('next-auth.session-token')

            if (cookie) return cookie; else return '';

        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge })
    },
        authOptions.callbacks.jwt['decode'] = async (token, secret) => {
            if (req.query.nextauth.includes('callback') && req.query.nextauth.includes('credentials') && req.method === 'POST') {
                return null
            }

            // Revert to default behaviour when not in the credentials provider callback flow
            return decode({ token, secret })
        }
    return await NextAuth(req, res, authOptions);
}
