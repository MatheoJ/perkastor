import { Fact, FactChain, User, Location, HistoricalPerson, FactChainItem } from "@prisma/client"

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

export interface FactProps extends Fact {
    author: {
        id: string;
        name: string;
    };
    tags: {
        id: string;
        name: string;
    }[];
    location: {
        id: string;
        name: string;
    };
    personsInvolved: {
        id: string;
        name: string;
    }[];
}

export interface FactChainItemProps extends FactChainItem {
    factChain: {
        id: string;
        name: string;
    };
    fact: FactProps;
}