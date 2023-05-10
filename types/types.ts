import { Fact, FactChain, User, Location, HistoricalPerson } from "@prisma/client"

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
export type SearchFilters = {
    event: boolean,
    anecdote: boolean,
    chain: boolean,
    historicalFigure: boolean,
    location: boolean,
    user: boolean
}
export type SearchResult = {
    slice(arg0: number, arg1: number): unknown
    length: number
    events: Fact[],
    anecdotes: Fact[],
    chains: FactChain[],
    users: User[],
    locations: Location[],
    historicalPersons: HistoricalPerson[]
}