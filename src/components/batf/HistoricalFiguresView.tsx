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

import crypto from 'crypto';

function get_image_url(filename: string): string {
    filename = filename.replace(' ', '_');
    let m = crypto.createHash('md5');
    m.update(filename);
    let md5hash = m.digest('hex');
    return `https://upload.wikimedia.org/wikipedia/commons/${md5hash[0]}/${md5hash.substring(0, 2)}/${filename}`;
}

const HistoricalFigureView: NextPage<Props> = (props) => {
    const { historicalPerson } = props;

    if (!historicalPerson) {
        return null;
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
                <div className="historicalFigureHeadRight">
                        {
                            !isNaN(historicalPerson.birthDate.getTime()) &&
                            <h4>
                                Né.e le : {historicalPerson.birthDate.getDate()} - {historicalPerson.birthDate.getMonth() + 1} - {historicalPerson.birthDate.getFullYear()}
                            </h4>
                        }
                        {
                            !isNaN(historicalPerson.deathDate.getTime()) &&
                            <h4>
                                Mort.e le : {historicalPerson.deathDate.getDate()} - {historicalPerson.deathDate.getMonth() + 1} - {historicalPerson.deathDate.getFullYear()}
                            </h4>
                        }
                    </div>
            </div>
            <div className="historicalFigureBody">
                <div className='content-left'>
                    <p>{historicalPerson.shortDesc}</p>
                    <p>{historicalPerson.content}</p>
                </div>
                <div className='content-right'>
                    {historicalPerson.image ? (
                        <div className="historicalFigureImage">
                            <Image src={historicalPerson.image ? get_image_url(historicalPerson.image.split("File:")[1]) : "image_default/einstein.jpg"} alt="" width={300} height={200} />
                        </div>
                    ) : null}
                </div>
            </div>
            {historicalPerson.facts ? (
                <div className='historicalFigureBody'>
                    <div>
                        Anecdotes et Événements associés :
                        <div className="content">
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
