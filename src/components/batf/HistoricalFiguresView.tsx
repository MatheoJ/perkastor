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
import FactList from '../FactList';

function get_image_url(filename: string): string {
    filename = filename.replace(' ', '_');
    let m = crypto.createHash('md5');
    m.update(filename);
    let md5hash = m.digest('hex');
    return `https://upload.wikimedia.org/wikipedia/commons/${md5hash[0]}/${md5hash.substring(0, 2)}/${filename}`;
}

const HistoricalFigureView: NextPage<Props> = (props) => {
    const { historicalPerson } = props;
    console.log(historicalPerson);
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
                    {historicalPerson.image ? (
                        <div className="historicalFigureImage">
                            <Image src={historicalPerson.image ? get_image_url(historicalPerson.image.split("File:")[1]) : "image_default/einstein.jpg"} alt="" width={300} height={200} />
                        </div>
                    ) : null}
                    <div>
                        {
                            !isNaN(historicalPerson.birthDate.getTime()) &&
                            <p>
                                Né.e le : {historicalPerson.birthDate.getDate()} - {historicalPerson.birthDate.getMonth() + 1} - {historicalPerson.birthDate.getFullYear()}
                            </p>
                        }
                        {
                            !isNaN(historicalPerson.deathDate.getTime()) &&
                            <p>
                                Décédé.e le : {historicalPerson.deathDate.getDate()} - {historicalPerson.deathDate.getMonth() + 1} - {historicalPerson.deathDate.getFullYear()}
                            </p>
                        }
                    </div>

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
