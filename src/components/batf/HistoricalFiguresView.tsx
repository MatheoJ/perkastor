import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HistoricalPerson, Fact } from '@prisma/client';
import { NextPage } from 'next';
import crypto from 'crypto';


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
    console.log("hist", historicalPerson);
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
        historicalPerson.deathDate = new Date(historicalPerson.deathDate)
    }

    return (
        <div className="historicalFigure">
            <div className="historicalFigureHead">
                <div className="historicalFigureHeadTop">
                    <h1>{historicalPerson.name}</h1>
                </div>
                <div className="historicalFigureHeadBottom">
                    {
                        !isNaN(historicalPerson.birthDate.getTime()) &&
                        <h4>
                            Né.e le {historicalPerson.birthDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h4>
                    }
                    {
                        !isNaN(historicalPerson.deathDate.getTime()) &&
                        <h4>
                            Mort.e le {historicalPerson.deathDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h4>
                    }
                </div>
            </div>
            <div className="historicalFigureBody">
                <div className='content-left'>
                    <strong>Description</strong>
                    {historicalPerson.shortDesc && <p>{historicalPerson.shortDesc.charAt(0).toUpperCase() + historicalPerson.shortDesc.slice(1)}</p>}
                    {historicalPerson.content && <p>{historicalPerson.content.charAt(0).toUpperCase() + historicalPerson.content.slice(1)}</p>}
                </div>

                <div className='content-right'>

                    {historicalPerson.image && (
                        <div className="historicalFigureImage">
                            <Image
                                src={
                                    historicalPerson.image
                                }
                                alt=""
                                width={150}
                                height={200}
                                layout="responsive"
                            />
                        </div>
                    )}
                </div>
            </div>
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
