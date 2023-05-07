export type ExtendedSession = {
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
        token?: string | null
        role: string
    }
    expires: string
}