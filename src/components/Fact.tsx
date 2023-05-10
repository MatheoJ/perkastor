import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Fact as FactType, HistoricalPerson } from '@prisma/client'
import logo from "src/images/perecastor.png";

interface FactProps extends FactType {
    author: {
        id: string;
        name: string;
    };
    location: {
        id: string;
        name: string;
    };
    personsInvolved: [
        {
            historicalPerson: HistoricalPerson;
        }
    ];
    keyDates: Date[];
}
interface Props {
    fact: FactProps;
}

const Fact: React.FC<Props> = (props) => {
    const { fact } = props;

    // Tri des keyDates dans l'ordre chronologique
    const sortedDates = fact.keyDates
        .map(dateStr => new Date(Date.parse(dateStr.toString())))
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    return (
        <div className="fact">
            <div className="factHead">
                <div className="factHeadTop">
                    <h1>{fact.title}</h1>
                </div>
                <div className="factHeadBottom">
                    <div className="factHeadBottomLeft">
                        <ul>
                            <li key={fact.location.id}>{fact.location.name}</li>
                        </ul>
                    </div>
                    <div className="factHeadBottomRight">
                        <h2>
                            <ul>
                                {sortedDates.map((date) => {
                                    return <li key={date.getTime()}>{date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}</li>
                                })}
                            </ul>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="factBody">
                {true ? (
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <div className="factImage">
                                <Image src={logo} alt="" width={300} height={200} />
                            </div>
                            <ul>
                                {fact.personsInvolved.map((person) => (
                                    <li key={person.historicalPerson.id}>
                                        {person.historicalPerson.name}    
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="content">
                        <p>{fact.content}</p>
                        <ul>
                            {fact.personsInvolved.map((person) => (
                                <li key={person.historicalPerson.id}>{person.historicalPerson.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fact;
