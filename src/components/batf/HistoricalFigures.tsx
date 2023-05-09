import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HistoricalPerson, Fact } from '@prisma/client';
import { NextPage } from 'next';

/* interface HistoricalFigureProps {
    historicalFigure: {
        id: string;
        name: string;
        birthDate?: string;
        deathDate?: string;
        image?: string;
        shortDesc?: string;
        content?: string;
    };
} */

interface HistoricalFigureProps extends HistoricalPerson {
    facts: Fact[]
}

interface Props {
    historicalPerson: HistoricalFigureProps
}




const HistoricalFigure: NextPage<Props> = (props) => {
    const { historicalPerson } = props;
    //console.log(historicalPerson)

    return (
        <div className="historicalFigure">
            <div className="historicalFigureHead">
                <div className="historicalFigureHeadTop">
                    <h1>{historicalPerson.name}</h1>
                </div>
                <div className="historicalFigureHeadBottom">
                    <div className="historicalFigureHeadBottomLeft">
                        {/* <ul>
                        {fact.locations.map((location) => (
                            <li key={location.id}>{location.name}</li>
                        ))
                        }
                    </ul> */}
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
                    <div className="historicalFigureImage">
                        <Image src={historicalPerson.image} alt="" width={300} height={200} />
                    </div>
                    <div>
                        <p>Né.e le : {historicalPerson.birthDate.getDay()} - {historicalPerson.birthDate.getMonth()} - {historicalPerson.birthDate.getFullYear()}</p>
                        <p>Décédé.e le : {historicalPerson.deathDate.getDay()} - {historicalPerson.deathDate.getMonth()} - {historicalPerson.deathDate.getFullYear()}</p>
                    </div>
                </div>
            </div>
            <div className='historicalFigureBody'>
                <div>
                    Anecdotes et Événements associés : 
                    <div className = "content">
                        <ul>
                        {historicalPerson.facts.map(elem => {
                            return (<li>
                                {elem.shortDesc}
                            </li>)
                        })} 
                        </ul>
                        </div>
                    </div>
                </div>
        </div>
        
    );
};


export default HistoricalFigure;
