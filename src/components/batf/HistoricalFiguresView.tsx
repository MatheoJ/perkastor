    import React, { useEffect, useState } from 'react';
    import Image from 'next/image';
    import { HistoricalPerson, Fact } from '@prisma/client';
    import { NextPage } from 'next';

    interface HistoricalFigureProps extends HistoricalPerson {
        facts: Fact[]
    }

    interface Props {
        historicalPerson: HistoricalFigureProps
    }




    const HistoricalFigureView: NextPage<Props> = (props) => {
        const { historicalPerson } = props;
        
        if (!historicalPerson) {
            return null; 
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
                                return (<li key={elem.id}>
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


    export default HistoricalFigureView;
