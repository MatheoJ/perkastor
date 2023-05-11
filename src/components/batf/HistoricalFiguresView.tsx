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
    filename = filename.replace("https://commons.wikimedia.org/wiki/File:","");
    filename = filename.replace(' ', '_');
    const md5hash = crypto.createHash('md5').update(filename).digest('hex');
    return `https://upload.wikimedia.org/wikipedia/commons/${md5hash[0]}/${md5hash.slice(0, 2)}/${filename}`;
}


const HistoricalFigureView: NextPage<Props> = (props) => {
    const { historicalPerson } = props;

    if(historicalPerson.image && historicalPerson.image.startsWith("https://commons.wikimedia.org/wiki/File:")) {
        historicalPerson.image=getImageUrl(historicalPerson.image)
    }

    if (!historicalPerson) {
        return null; 
    }
    if(!((historicalPerson.birthDate) instanceof Date)){
        historicalPerson.birthDate = new Date(historicalPerson.birthDate)
    }
    if(!((historicalPerson.deathDate) instanceof Date)){
        historicalPerson.deathDate = new Date(historicalPerson.deathDate)
    }

    return (
        <div className="historicalFigure">
            <div className="historicalFigureHead">
                <div className="historicalFigureHeadTop">
                    <h1>{historicalPerson.name}</h1>
                </div>
                <div className="historicalFigureHeadBottom">
                    <div className="historicalFigureHeadBottomLeft">
                    </div>
                    <div className="historicalFigureHeadBottomRight">
                    </div>
                </div>
            </div>
            <div className="historicalFigureBody">
                <div className='content-left'>
                    <p>{historicalPerson.shortDesc}</p>
                    <p>{historicalPerson.content}</p>
                </div>
                <div className='content-right'>

                    {historicalPerson.image && (
                        <div className="historicalFigureImage">
                        <Image
                            src={
                                historicalPerson.image
                            }
                            alt=""
                            width={300}
                            height={200}
                        />
                        </div>
                    )}
                    <div>
                        <p>Né.e le : {historicalPerson.birthDate.getDay()} - {historicalPerson.birthDate.getMonth()} - {historicalPerson.birthDate.getFullYear()}</p>
                        <p>Décédé.e le : {historicalPerson.deathDate.getDay()} - {historicalPerson.deathDate.getMonth()} - {historicalPerson.deathDate.getFullYear()}</p>
                    </div>
                </div>
            </div>
            {historicalPerson.facts ? (
            <div className='historicalFigureBody'>
                <div>
                    Anecdotes et Événements associés : 
                    <div className = "content">
                        <ul>
                        {historicalPerson.facts.map(elem => {
                            return (<li key={elem.id}>
                                {elem.shortDesc}
                            </li>)
                        })} 
                        </ul>
                    </div>
                </div>
            </div>
            ) : null}
        </div>
        
    );
};


export default HistoricalFigureView;
