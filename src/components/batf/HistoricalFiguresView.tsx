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
    var errorDeathDate = false;
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
    if (historicalPerson.deathDate.toDateString().split(' ')[1] === 'Jan' && historicalPerson.deathDate.toDateString().split(' ')[2] === '01' && historicalPerson.deathDate.getFullYear() === 1970) {
        errorDeathDate = true;
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
                            !errorDeathDate &&
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

export default HistoricalFigureView;
