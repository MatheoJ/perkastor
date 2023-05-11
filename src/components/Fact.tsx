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
import { classNames } from 'react-easy-crop/helpers';
import ImageWithFallback from './ImageWithFallback';

interface Props {
    fact: FactProps;
}

const Fact: NextPage<Props> = ({ fact }) => {
    // Tri des keyDates dans l'ordre chronologique
    const sortedDates = fact.keyDates
        .map(dateStr => new Date(Date.parse(dateStr.toString())))
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

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

    const formatDate = (date: Date): string => {
        if (date.getFullYear() === 1 || date.getFullYear() === 4) {
            return 'N/A'
        }
        console.log(date.toDateString().split(' ')[1])
        if (date.toDateString().split(' ')[1] === 'Jan' && date.toDateString().split(' ')[2] === '01' && date.getFullYear() === 1970) {
            return 'N/A'
        }
        if (date.toDateString().split(' ')[1] === 'Jan' && date.toDateString().split(' ')[2] === '01') {
            return date.getFullYear().toString();
        }
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div className="fact">
            <div className="factHead">
                {fact.title ?
                    <>
                        <div className="factHeadTop">
                            <h1 className={'mark'}>{fact.title}</h1>
                        </div>
                        <div className="factHeadBottom">
                            {
                                fact.bannerImg ?
                                    <>
                                        <div className="factHeadBottomLeft">
                                            <p className='no-margin'>
                                                <span className="text-bold">Lieu:</span>
                                                <br />
                                                <span key={fact.location.id}>{fact.location.name}</span>
                                            </p>
                                            <p className='no-margin'><span className="text-bold">Date{sortedDates.length > 1 ? 's' : ''}:</span></p>
                                            <ul className='no-margin'>
                                                {sortedDates.map((date) => {
                                                    return <li key={date.getTime()}>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>;
                                                })}
                                            </ul>
                                        </div>
                                        <div className="factHeadBottomRight">
                                            <div className="factImage">
                                                <ImageWithFallback src={fact.bannerImg} alt="" width={300} height={200} fallback='/resources/404-error.png' />
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div className="factHeadBottomLeft">
                                            <p className='no-margin'>
                                                <span className="text-bold">Lieu:</span>
                                                <br />
                                                <span key={fact.location.id}>{fact.location.name}</span>
                                            </p>
                                        </div>
                                        <div className="factHeadBottomRight">
                                            <p className='no-margin'><span className="text-bold">Date{sortedDates.length > 1 ? 's' : ''}:</span></p>
                                            <ul className='no-margin'>
                                                {sortedDates.map((date) => {
                                                    return <li key={date.getTime()}>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>;
                                                })}
                                            </ul>
                                        </div>
                                    </>
                            }

                        </div>
                    </> :
                    <div className="factHeadTop">
                        <h1 className={'display-2'}>
                            L'évènement {sortedDates.length > 1 ? 'des ' : (formatDate(sortedDates[0]) === 'N/A' ? '' : formatDate(sortedDates[0]).length > 4 ? 'du ' : 'de ')}
                            {sortedDates.map((date, index) => {
                                const formattedDate = formatDate(date);
                                return (
                                    <>
                                        <span key={date.getTime()} className={'mark'}>
                                            {index > 0 ? (index === sortedDates.length - 1 ? ' et ' : ', ') : ''}
                                            {formattedDate !== 'N/A' ? formattedDate : ''}
                                        </span>

                                    </>
                                );
                            })}
                            &nbsp;dans&nbsp;
                            <span key={fact.location.id} className={'mark'}>
                                {getLocationText(fact.location.type, fact.location.name)}
                            </span>
                        </h1>
                    </div>
                }


            </div>
            <div className="divider-line" />
            <div className="factBody">
                {fact.bannerImg && fact.personsInvolved && fact.personsInvolved.length ? ( //test : there are both images and personsInvolved
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            {
                                fact.title ?
                                    null :
                                    <div className="factImage">
                                        <ImageWithFallback src={fact.bannerImg} alt="" width={300} height={200} fallback='/resources/404-error.png' />
                                    </div>
                            }
                            <ul>
                                {fact.personsInvolved.map((person) => (<li key={person.historicalPerson.id}>{person.historicalPerson.name}</li>))}
                            </ul>
                        </div>
                    </>
                ) : fact.bannerImg ? (//test : there is an image and no personsInvolved
                    <>
                        {
                            fact.title ?
                                <div className='column'>
                                    <strong>Description</strong>
                                    <p>{fact.content}</p>
                                </div> :
                                <>
                                    <div className="content-left">
                                        <strong>Description</strong>
                                        <p>{fact.content}</p>
                                    </div>
                                    <div className='content-right'>
                                        <div className="factImage">
                                            <ImageWithFallback src={fact.bannerImg} alt="" width={300} height={200} fallback='/resources/404-error.png' />
                                        </div>
                                    </div>
                                </>
                        }

                    </>
                ) : fact.personsInvolved && fact.personsInvolved.length ? ( //test : there are personsInvolved and no image 
                    <>
                        <div className="content-left">
                            <strong>Description</strong>
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <strong>Personnages historiques</strong>
                            <ul className='no-margin'>
                                {fact.personsInvolved.map((person) => (
                                    <li onClick={() => { bus.publish(selectHistoricalFigureFromSearchBar(person.historicalPerson as HistoricalPerson)) }} style={{ cursor: "pointer", color: '#3366cc', }} key={person.historicalPerson.id}>
                                        {person.historicalPerson.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : ( //test : there are no personsInvolved and no image
                    <div className="fact-content">
                        <strong>Description</strong>
                        <p>{fact.content}</p>
                    </div>

                )}
            </div>
            {(fact.video.length || fact.audio.length) ? (
                <>
                    <div className="divider-line" />
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
                </>
            ) : null}
            {(fact.sources.length || fact.author) ? (
                <>
                    <div className="divider-line" />
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
                </>
            ) : null}

            <div className="divider-line" />
            <p className="factVerified">
                {fact.verified ?
                    <span className="verifiedIcon">
                        <VerifiedIcon style={{ color: 'green' }} />
                    </span> :
                    <span className="uncheckedIcon">
                        <UnpublishedIcon style={{ color: 'red' }} />
                    </span>}
                <span className="verifiedText">{fact.verified ? 'Source vérifiée' : 'Source non vérifiée'}</span>
            </p>
        </div>
    );
};

export default Fact;
