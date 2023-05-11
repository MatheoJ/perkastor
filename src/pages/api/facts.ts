import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { ExtendedSession } from 'types/types';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/db'
import ObjectID from 'bson-objectid';
//const { hasSome } = require('prisma-multi-tenant');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const { fid, userId, description, startDate, endDate, histPersonName, histPersonId, locationId, locationName, latitude, longitude} = req.query;

    const session: ExtendedSession = await getServerSession(req, res, authOptions)

    try {
        let prismaResult;
        switch (method) {
            case "GET":
                if (fid) {
                    prismaResult = await prisma.fact.findUnique({
                        where: {
                            id: Array.isArray(fid) ? fid[0] : fid
                        },
                        include: {
                            personsInvolved: {
                                select: {
                                    historicalPerson: true,
                                },
                            },
                            location: true,
                            author  : true,
                        },
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                        return;
                    } else {
                        res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                        return;
                    }
                } else if (userId) {
                    prismaResult = await prisma.user.findUnique({
                        where: {
                            id: Array.isArray(userId) ? userId[0] : userId
                        },
                        include: {
                            facts: {
                                include: {
                                    personsInvolved: {
                                        select: {
                                            historicalPerson: true,
                                        },
                                    },
                                    location: true,
                                },
                            }
                        }
                    });
                    let result = [];
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult.facts });
                        return;
                    } else {
                        res.status(422).json({ message: `L'utilisateur d'id ${userId} n\'existe pas.` });
                        return;
                    }
                } else if (description) {
                    prismaResult = await prisma.fact.findMany({
                        where: {
                            content: {
                                contains: Array.isArray(description) ? description[0] : description, // Case insensitive search
                                mode: 'insensitive',
                            }
                        },
                        include: {
                            personsInvolved: {
                                select: {
                                    historicalPerson: true,
                                },
                            },
                            location: true,
                            author: true,
                        },                        
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                        return;
                    } else {
                        res.status(422).json({ message: `Aucun fait historique ne contient la description ${description}.` });
                        return;
                    }
                } else if (startDate && !endDate || endDate && !startDate) {
                    let date = startDate || endDate;
                    // Extraire l'année de la date passée en paramètre
                    const inputDate = new Date(Array.isArray(date) ? date[0] : date);

                    // Utiliser la fonction findMany avec une condition pour vérifier si l'une des keyDates a la même année que l'année extraite
                    const allFacts = await prisma.fact.findMany();
                    // add 1 year to the input date
                    const inputEndDate = new Date(inputDate.getFullYear() + 1, inputDate.getMonth(), inputDate.getDate());
                    prismaResult = allFacts.filter((fact) => {
                        return fact.keyDates.some((date) => {
                            return date >= inputDate && date < inputEndDate;
                        });
                    });

                    /*
                    prismaResult = await prisma.fact.findMany({
                    where: {
                        AND: [
                        hasSome({
                            keyDates: {
                            gte: inputYearStart,
                            },
                        }),
                        hasSome({
                            keyDates: {
                            lt: inputYearEnd,
                            },
                        }),
                        ],
                    },
                    });
                    */

                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                        return;
                    } else {
                        res.status(422).json({ message: `Aucun fait historique ne contient la date ${date}.` });
                        return;
                    }
                } else if (startDate && endDate) {
                    let dateStart = startDate;
                    let dateEnd = endDate;
                    // Extraire l'année de la date passée en paramètre
                    const inputDateStart = new Date(Array.isArray(dateStart) ? dateStart[0] : dateStart);
                    const inputDateEnd = new Date(Array.isArray(dateEnd) ? dateEnd[0] : dateEnd);
                    // Utiliser la fonction findMany avec une condition pour vérifier si l'une des keyDates a la même année que l'année extraite
                    const allFacts = await prisma.fact.findMany();

                    prismaResult = allFacts.filter((fact) => {
                        return fact.keyDates.some((date) => {
                            return date >= inputDateStart && date < inputDateEnd;
                        });
                    });

                    /*
                    prismaResult = await prisma.fact.findMany({
                    where: {
                        AND: [
                        hasSome({
                            keyDates: {
                            gte: inputYearStart,
                            },
                        }),
                        hasSome({
                            keyDates: {
                            lt: inputYearEnd,
                            },
                        }),
                        ],
                    },
                    });
                    */

                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                        return;
                    } else {
                        res.status(422).json({ message: `Aucun fait historique ne contient la date ${dateStart} et ${dateEnd}.` });
                        return;
                    }
                } else if (histPersonName) {
                    prismaResult = await prisma.historicalPerson.findMany({
                        where: {
                            name: {
                                contains: Array.isArray(histPersonName) ? histPersonName[0] : histPersonName,
                                mode: 'insensitive', // Case insensitive search
                            },
                        },
                        include: {
                            FactHistoricalPerson: {
                                select: {
                                    fact: {
                                        include: {
                                            personsInvolved: {
                                                select: {
                                                    historicalPerson: true,
                                                },
                                            },
                                            location: true,
                                            author: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
                    let result = [];
                    prismaResult.forEach((person) => {
                        result = result.concat(person.FactHistoricalPerson.map((fact) => {
                            return fact.fact;
                        }
                        ));
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: result });
                        return;
                    } else {
                        res.status(422).json({ message: `Aucun personnage historique ne contient le nom ${histPersonName}.` });
                        return;
                    }
                } else if (histPersonId) {
                    prismaResult = await prisma.historicalPerson.findMany({
                        where: {
                            id: Array.isArray(histPersonId) ? histPersonId[0] : histPersonId
                        },
                        include: {
                            FactHistoricalPerson: {
                                select: {
                                    fact: {
                                        include: {
                                            personsInvolved: {
                                                select: {
                                                    historicalPerson: true,
                                                },
                                            },
                                            location: true,
                                            author: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
                    if (prismaResult) {
                        let result = [];
                        prismaResult.forEach((person) => {
                            result = result.concat(person.FactHistoricalPerson.map((fact) => {
                                return fact.fact;
                            }
                            ));
                        });
                        res.status(200).json({ statusCode: 200, data: result });
                        return;
                    } else {
                        res.status(422).json({ message: `Le personnage historique d'id ${histPersonId} n\'existe pas.` });
                        return;
                    }

                } else if (locationId || locationName || (latitude && longitude)){
                    prismaResult = await prisma.location.findMany({
                        where: {
                            OR: [
                                {
                                    id: locationId as string
                                },
                                {
                                    name: locationName as string
                                },
                                {
                                    latitude: parseFloat(latitude as string) || 0,
                                    longitude: parseFloat(longitude as string) || 0,
                                },
                            ]
                        },
                        include: {
                            facts: {
                                include: {
                                    personsInvolved: {
                                        select: {
                                            historicalPerson: true,
                                        },
                                    },
                                    location: true,
                                },
                            },
                        },
                    });  
                    let result = [];
                    prismaResult.forEach((location) => {
                        result = result.concat(location.facts);
                    });
                    if (prismaResult) {
                        res.status(200).json({ statusCode: 200, data: result });
                        return;
                    }
                    else {
                        res.status(422).json({ message: `Aucun lieu ne contient l'id ${locationId}, le nom ${locationName} ou les coordonnées ${latitude}, ${longitude}.` });
                        return;
                    }
                              
                }  else {
                    prismaResult = await prisma.fact.findMany({take: 50});
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                    return;
                }
                break;
            case "POST":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    
                    return;
                }

                if (!req.body.location) {
                    res.status(422).json({ message: `Le lieu n\'est pas renseigné.` });
                    return;
                }


                let createLocation: boolean = false;
                let location;
                // search location by id
                if (req.body.location.hasOwnProperty("id") && req.body.location.id !== "") {
                    // Check if the fact's location exists
                    location = await prisma.location.findUnique({
                        where: {
                            id: req.body.location.id
                        },
                    });
                    if (!location) {
                        res.status(422).json({ message: `Le lieu n\'existe pas.` });
                        return;
                    }
                }
                // search location by [coordinates, name] pair
                else {
                    if (!req.body.location.latitude || !req.body.location.longitude) {
                        res.status(422).json({ message: `Les coordonnées du lieu ne sont pas renseignées.` });
                        return;
                    }
                    if (!req.body.location.name) {
                        res.status(422).json({ message: `Le nom du lieu n'est pas renseigné.` });
                        return;
                    }

                    // check if the location doesn't already exist
                    location = await prisma.location.findFirst({
                        where: {
                            
                                    latitude: parseFloat(req.body.location.latitude),
                               
                                    longitude: parseFloat(req.body.location.longitude),
                                
                                    name: req.body.location.name,
                                }        
                        
                    });
                    
                    if (location) {
                        if (!location.hasFact) {
                            await prisma.location.update({
                                where: {
                                    id: location.id
                                },
                                data: {
                                    hasFact: true
                                }
                            })
                        }
                    } else {
                        createLocation = true;
                    }
                }
                
                let locPayload;
                if (createLocation) {
                    locPayload = {
                        create: {
                            latitude: parseFloat(req.body.location.latitude),
                            longitude: parseFloat(req.body.location.longitude),
                            name: req.body.location.name,
                            type: req.body.location.type,
                            geometry: "Point",
                            area: req.body.location.area,
                            hasFact: true
                        }
                    }
                } else {
                    locPayload = {
                        connect: {
                            id: location.id
                        }
                    }
                }
                // if the user is an admin, he can create a foundFact for another user
                if (session.user.role === "admin") {
                    if (!req.body.author) {
                        req.body.author = session.user.id;
                    } else {
                        // check if the author exists
                        const author = await prisma.user.findUnique({
                            where: {
                                id: req.body.author
                            }
                        });
                        if (!author) {
                            res.status(422).json({ message: `L'auteur n\'existe pas.` });
                            return;
                        }
                    }
                } else {
                    req.body.author = session.user.id;
                }


                try{
                    const id = ObjectID().toHexString();               
                    var personsInvolved = req.body.idHistoricalFigure.map((person: any) => ({
                    historicalPerson: {
                        connect: {
                        id: person,
                        },
                    },
                    }));

                    const fact: any = {
                        id: id,
                        title: req.body.title,
                        shortDesc: req.body.shortDesc,
                        content: req.body.content,
                        keyDates: req.body.keyDates.map((date) => {
                            return new Date(date);
                        }),
                        bannerImg: req.body.bannerImg,
                        video: req.body.video || [],
                        audio: req.body.audio || [],
                        personsInvolved: {
                            create: personsInvolved,
                        },
                        author: {
                            connect:{
                                id: session.user.id,
                            }
                        },
                        location: locPayload,
                        sources: req.body.sources || []
                    };
                    
                    prismaResult = await prisma.fact.create({
                        data: fact,
                    });
                }
                catch(e){
                    console.log(e);
                }

                if (prismaResult) {
                    res.status(201).json({ statusCode: 201, data: prismaResult });
                    return;
                } else {
                    res.status(422).json({ message: `Le fait historique n\'a pas pu être créé.` });
                    return;
                }
                break;
            case "PUT": // used for partial modification of a resource

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                    return;
                }
                // Check if the foundFact exists
                var foundFact = await prisma.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!foundFact ) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }

                // if the user is an admin, he can create a foundFact for another user
                if (session.user.role === "admin") {
                    if (!req.body.author) {
                        req.body.author = session.user.id;
                    } else {
                        // check if the author exists
                        const author = await prisma.user.findUnique({
                            where: {
                                id: req.body.author
                            }
                        });
                        if (!author) {
                            res.status(422).json({ message: `L'auteur n\'existe pas.` });
                            return;
                        }
                    }
                } else {
                    req.body.author = session.user.id;
                }

                // the difference between http put and http patch is that put is idempotent
                // so we can't use put to update a fact, we have to use patch
                prismaResult = await prisma.fact.update({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                    data: {
                        title: req.body.title,
                        shortDesc: req.body.shortDesc,
                        content: req.body.content,
                        keyDates: req.body.keyDates,
                        bannerImg: req.body.bannerImg,
                        video: req.body.video || [],
                        audio: req.body.audio || [],
                        personsInvolved: req.body.personsInvolved || [],
                        author: req.body.author,
                        location: locPayload,
                        sources: req.body.sources || [],
                    },
                });

                if (prismaResult) {
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                    return;
                } else {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'a pas pu être mis à jour.` });
                    return;
                }
                break;
            case "PATCH":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                    return;
                }
                // Check if the foundFact exists
                foundFact = await prisma.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!foundFact ) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }
                // the difference between http put and http patch is that put is idempotent
                // so we can't use put to update a fact, we have to use patch
                let patchData = {}
                if (req.body.title) {
                    patchData["title"] = req.body.title
                }
                if (req.body.shortDesc) {
                    patchData["shortDesc"] = req.body.shortDesc
                }
                if (req.body.content) {
                    patchData["content"] = req.body.content
                }
                if (req.body.keyDates) {
                    patchData["keyDates"] = req.body.keyDates
                }
                if (req.body.bannerImg) {
                    patchData["bannerImg"] = req.body.bannerImg
                }
                if (req.body.video) {
                    patchData["video"] = req.body.video
                }
                if (req.body.audio) {
                    patchData["audio"] = req.body.audio
                }
                if (req.body.personsInvolved) {
                    patchData["personsInvolved"] = req.body.personsInvolved
                }
                if (req.body.location) {
                    // check if the location exists
                    patchData["location"] = req.body.location
                }
                if (req.body.author && session.user.role === "admin") {
                    patchData["author"] = req.body.author
                }
                if (req.body.sources) {
                    patchData["sources"] = req.body.sources
                }
                prismaResult = await prisma.fact.update({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                    data: patchData,
                });

                if (res) {
                    res.status(200).json({ statusCode: 200, data: prismaResult });
                    return;
                } else {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'a pas pu être mis à jour.` });
                    return;
                }

                break;
            case "DELETE":

                if (!session) {
                    res.status(401).json({ message: 'Non authentifié !' });
                    return;
                }

                if (!fid) {
                    res.status(422).json({ message: `L'id du fait historique n\'est pas renseigné.` });
                    return;
                }
                // Check if the foundFactexists
                foundFact= await prisma.fact.findUnique({
                    where: {
                        id: Array.isArray(fid) ? fid[0] : fid
                    },
                });
                if (!foundFact ) {
                    res.status(422).json({ message: `Le fait historique d'id ${fid} n\'existe pas.` });
                    return;
                }

                // if the user is an admin, he can delete a foundFactfor another user
                if (session.user.role === "admin" || session.user.id === foundFact.authorId) {
                    prismaResult = await prisma.fact.delete({
                        where: {
                            id: Array.isArray(fid) ? fid[0] : fid
                        },
                    });
                    if(prismaResult){
                        const fact = await prisma.fact.findFirst({
                            where: {
                                locationId: foundFact.locationId    
                            }
                        });
                        if(!fact){
                            await prisma.location.update({
                                where: {
                                    id: foundFact.locationId
                                },
                                data: {
                                    hasFact: false
                                }
                            })
                        }
                        res.status(200).json({ statusCode: 200, data: prismaResult });
                        return;
                    }else{
                        res.status(422).json({ message: `Le fait historique d'id ${fid} n\'a pas pu être supprimé.` });
                        return;
                    }
                } else {
                    res.status(401).json({ message: 'Non autorisé !' });
                    return;
                }

                break;
            default:
                res.status(405).end(`Method ${method} Not Allowed`);
                return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: JSON.stringify(error) });
        return;
    }
}
