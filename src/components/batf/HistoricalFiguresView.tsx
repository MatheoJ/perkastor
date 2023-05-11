import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HistoricalPerson, Fact } from '@prisma/client';
import { NextPage } from 'next';
import crypto from 'crypto';
import FactList from '../FactList';


interface HistoricalFigureProps extends HistoricalPerson {
    facts: Fact[]
}

interface Props {
    historicalPerson: HistoricalFigureProps
}

function getImageUrl(filename: string): string {
    filename = filename.replace("https://commons.wikimedia.org/wiki/File:", "");
    filename = filename.replace(' ', '_');
    const md5hash = crypto.createHash('md5').update(filename).digest('hex');
    return `https://upload.wikimedia.org/wikipedia/commons/${md5hash[0]}/${md5hash.slice(0, 2)}/${filename}`;
}


const HistoricalFigureView: NextPage<Props> = (props) => {
    const { historicalPerson } = props;
    if (!historicalPerson) {
        return null;
    }

    if (historicalPerson.image && historicalPerson.image.startsWith("https://commons.wikimedia.org/wiki/File:")) {
        historicalPerson.image = getImageUrl(historicalPerson.image)
    }

    if (!((historicalPerson.birthDate) instanceof Date)) {
        historicalPerson.birthDate = new Date(historicalPerson.birthDate)
    }
    if (!((historicalPerson.deathDate) instanceof Date)) {
        if (historicalPerson.deathDate == "1970-01-01T00:00:00.000+00:00") {
            historicalPerson.deathDate = null;
        }
        historicalPerson.deathDate = new Date(historicalPerson.deathDate)
    }

    return (
        <div className="fact">
            <div className="factHead">
                <div className="factHeadTop">
                    <h1 className='mark'>{historicalPerson.name}</h1>
                </div>
                <div className="figureHeadBottom">
                    <div className="figureHeadBottomLeft">
                        {
                            !isNaN(historicalPerson.birthDate.getTime()) &&
                            <p>
                                Né.e le {historicalPerson.birthDate.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        }
                        {
                            !isNaN(historicalPerson.deathDate.getTime()) &&
                            <p>
                                Mort.e le {historicalPerson.deathDate.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        }
                    </div>

                    {historicalPerson.image ?
                        <div className="figureHeadBottomRight">
                            <div className="figureImage">
                                <Image src={historicalPerson.image} alt={`Image de ${historicalPerson.name}`} width={300} height={200} />
                            </div>
                        </div>
                        : null}
                </div>
            </div>
            {
                historicalPerson.shortDesc || historicalPerson.content ? (
                    <div className="historicalFigureBody">
                        <div className="divider-line" />
                        <strong>Description</strong>
                        {historicalPerson.shortDesc && <p>{historicalPerson.shortDesc.charAt(0).toUpperCase() + historicalPerson.shortDesc.slice(1)}</p>}
                        {historicalPerson.content && <p>{historicalPerson.content.charAt(0).toUpperCase() + historicalPerson.content.slice(1)}</p>}
                    </div>) : null
            }

            {historicalPerson.facts ? (
                <div className='historicalFigureBody'>
                    <div>
                        Anecdotes et Événements associés :
                        <div className="content">
                            <FactList facts={historicalPerson.facts} />
                        </div>
                    </div>
                </div>
            ) : null}
        </div>

    );
};

/*
<ul>
{historicalPerson.facts.map(elem => {
    return (<li key={elem.id}>
        {elem.shortDesc}
    </li>)
})}
</ul>
*/
export default HistoricalFigureView;
