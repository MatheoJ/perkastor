import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession, SearchFilters, SearchResult } from 'types/types';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/db'
//const { hasSome } = require('prisma-multi-tenant');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { query, filtersParam } = req.query;
    let filters: SearchFilters;
    try {
        filters = JSON.parse(filtersParam as string);
    } catch (error) {
        filters = {
            event: true,
            anecdote: true,
            chain: true,
            historicalFigure: true,
            location: true,
            user: true
        }
    }
    console.log(req.query)
    const session: ExtendedSession = await getServerSession(req, res, authOptions);
    let isEventValue;
    if ((filters.event && filters.anecdote) || (!filters.event && !filters.anecdote)) {
        // if both event and anecdote are true, ignore isEvent filter
        isEventValue = undefined;
    } else if (filters.event) {
        // if only event is true, set isEvent to true
        isEventValue = true;
    } else if (filters.anecdote) {
        // if only anecdote is true, set isEvent to false
        isEventValue = false;
    }
    try {
        switch (method) {
            case 'GET':
                let prismaResultFact;
                let prismaResultChain;
                let prismaResultLocation;
                let prismaResultHistoricalFigure;
                let prismaResultUser;
                // Get data from your database
                if (query) {
                    if (filters.event || filters.anecdote){
                        prismaResultFact = await client.fact.findMany({
                            take: 10,
                            where: {
                                
                                OR: [
                                    { title: { contains: query as string } },
                                    { content: { contains: query as string } },
                                    { author: { name: { contains: query as string } } },
                                ],
                                isEvent: isEventValue
                            }
                        });
                    }
                    if (filters.chain){
                        prismaResultChain = await client.factChain.findMany({
                            take: 10,
                            where: {
                                OR: [
                                    { title: { contains: query as string } },
                                    { description: { contains: query as string } },
                                    { author: { name: { contains: query as string } } },
                                ]
                            }
                        });
                    }
                    if (filters.location){
                        prismaResultLocation = await client.location.findMany({
                            take: 10,
                            where: {
                                name: { contains: query as string }
                            }
                        });
                    }
                    if (filters.historicalFigure){
                        //check if query is a date
                        var date = new Date(query as string);
                        if(isNaN(date.getTime())){
                            date = undefined;
                        }
                        prismaResultHistoricalFigure = await client.historicalPerson.findMany({
                            take: 10,
                            where: {
                                OR: [
                                    { name: { contains: query as string } },
                                    { birthDate: date },
                                    { deathDate: date },
                                    {shortDesc: {contains: query as string}}
                                ]
                            }
                        });
                    }
                    if (filters.user){
                        prismaResultUser = await client.user.findMany({
                            take: 10,
                            where: {
                                name: { contains: query as string }
                            }
                        });
                    }
                } else {
                    res.status(404).json({ message: "Aucune recherche effectuée" });
                }
                if (prismaResultFact || prismaResultChain || prismaResultLocation || prismaResultHistoricalFigure || prismaResultUser) {
                    const resultat : SearchResult = {
                        events: prismaResultFact,
                        anecdotes: prismaResultFact,
                        chains: prismaResultChain,
                        locations: prismaResultLocation,
                        historicalPersons: prismaResultHistoricalFigure,
                        users: prismaResultUser,
                        // TODO: modify this to return the number of results for each type
                        slice: function (arg0: number, arg1: number): unknown {
                            throw new Error('Function not implemented.');
                        },
                        length: 0
                    }

                    res.status(200).json({ data: resultat });
                }
                else {
                    res.status(404).json({ message: "Aucun résultat" });
                }
                break;
            }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
    }  
}