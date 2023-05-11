import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import VerifiedIcon from '@mui/icons-material/Verified';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { Fact as FactType, HistoricalPerson } from '@prisma/client'
import logo from "src/images/perecastor.png";
import { NextPage } from 'next';
import { FactProps } from 'types/types';
import { selectHistoricalFigureFromSearchBar } from '~/events/SelectSearchBarResultEvent';
import { bus } from "../utils/bus";

interface Props {
    fact: FactProps;
}

const Fact: NextPage<Props> = ({ fact }) => {
    // Tri des keyDates dans l'ordre chronologique
    const sortedDates = fact.keyDates
        .map(dateStr => new Date(Date.parse(dateStr.toString())))
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());


    return (
        <div className="fact">
            <div className="factHead">
                {fact.title ?
                    <><div className="factHeadTop">
                        <h1>{fact.title}</h1>
                    </div>
                        <div className="factHeadBottom">
                            <div className="factHeadBottomLeft">
                                <ul>
                                    <li key={fact.location.id}>{fact.location.name}</li>
                                </ul>
                            </div>
                            <div className="factHeadBottomRight">
                                <ul>
                                    {sortedDates.map((date) => {
                                        return <li key={date.getTime()}>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>;
                                    })}
                                </ul>
                            </div>
                        </div>
                    </> :
                    <div className="factHeadTop">
                        <h1>
                            L'évènement {sortedDates.length > 1 ? 'des ' : 'du '}
                            {sortedDates.map((date, index) => {
                                const formattedDate = date.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                const getLocationText = (type: string, name: string): string => {
                                    let locationString = "";
                                    if (type === "ville" || type === "commune" || type === "lieu-dit") {
                                        const firstLetter = type.charAt(0).toLowerCase();
                                        const article = (firstLetter === "a" || firstLetter === "e" || firstLetter === "i" || firstLetter === "o" || firstLetter === "u") ? "d'" : "de";
                                        locationString = `la ${type} ${article} ${name}`;
                                    } else if (type === "departement" || type === "pays") {
                                        locationString = `le ${type} ${name}`;
                                    } else if (type === "region") {
                                        locationString = `la ${type} ${name}`;
                                    } else {
                                        locationString = `${name}`;
                                    }
                                    return locationString;
                                };
                                return (
                                    <>
                                        <span key={date.getTime()}>
                                            {index > 0 ? (index === sortedDates.length - 1 ? ' et ' : ', ') : ''}
                                            {formattedDate}
                                        </span>
                                        <span key={fact.location.id}>
                                            {index === sortedDates.length - 1 ? ` dans ${getLocationText(fact.location.type, fact.location.name)}` : ''}
                                        </span>
                                    </>
                                );
                            })}
                        </h1>
                    </div>
                }


            </div>
            <div className="factBody">
                {fact.bannerImg && fact.personsInvolved && fact.personsInvolved.length ? ( //test : there are both images and personsInvolved
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <div className="factImage">
                                <Image src={fact.bannerImg} alt="" width={300} height={200} />
                            </div>
                            <ul>
                                {fact.personsInvolved.map((person) => (<li key={person.historicalPerson.id}>{person.historicalPerson.name}</li>))}
                            </ul>
                        </div>
                    </>
                ) : fact.bannerImg ? (//test : there is an image and no personsInvolved
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <div className="factImage">
                                <Image src={fact.bannerImg} alt="" width={300} height={200} />
                            </div>
                        </div>
                    </>
                ) : fact.personsInvolved && fact.personsInvolved.length ? ( //test : there are personsInvolved and no image 
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <strong>Personnages historiques</strong>
                            <ul>
                                {fact.personsInvolved.map((person) => (
                                    <li onClick={() => { bus.publish(selectHistoricalFigureFromSearchBar(person.historicalPerson as HistoricalPerson)) }} style={{ cursor: "pointer", textDecoration: "underline" }} key={person.historicalPerson.id}>
                                        {person.historicalPerson.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : ( //test : there are no personsInvolved and no image
                    <>
                        <div className="fact-content">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                    </>

                )}
            </div>
            {(fact.video.length || fact.audio.length) ? (
                <div className="factMedia">
                    {fact.video.length ? (
                        <div className="factVideo">
                            <strong>Vidéo</strong>
                            <ul>
                                {fact.video.map((video) => (
                                    <li key={video}></li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {fact.audio.length ? (
                        <div className="factAudio">
                            <strong>Audio</strong>
                            <ul>
                                {fact.audio.map((audio) => (
                                    <li key={audio}></li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {(fact.sources.length || fact.author) ? (
                <div className="factSource">
                    {fact.sources.length ? (
                        <div className="factSources">
                            <strong>Sources</strong>
                            <ul>
                                {fact.sources.map((source) => (
                                    <li key={source}></li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {fact.author ? (
                        <div className="factAuthor">
                            <strong>Auteur</strong>
                            <ul>
                                <li key={fact.author.id}>{fact.author.name}</li>
                            </ul>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {fact.verified ? (
                <div className="factVerified">
                    <div className="verifiedIcon">
                        <VerifiedIcon style={{ color: 'green' }} />
                    </div>
                    <div className="verifiedText">
                        <p>Source vérifiée</p>
                    </div>
                </div>
            ) : (
                <div className="factVerified">
                    <div className="uncheckedIcon">
                        <UnpublishedIcon style={{ color: 'red' }} />
                    </div>
                    <div className="uncheckedText">
                        <p>En attente de vérification</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fact;
