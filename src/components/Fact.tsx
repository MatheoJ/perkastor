import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {FactProps} from '../../types/types'

interface Props {
    fact: FactProps;
}

const Fact: React.FC<Props> = ( props ) => {
    const { fact } = props;
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
                            {fact.keyDates.map((date) => {
                                var dateObj = new Date(date);
                                return <li key={dateObj.getTime()}>{dateObj.getDate()} - {dateObj.getMonth()+1} - {dateObj.getFullYear()}</li>
                            })}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="factBody">
                {fact.bannerImg ? (
                    <>
                        <div className="content-left">
                            <p>{fact.content}</p>
                        </div>
                        <div className='content-right'>
                            <div className="factImage">
                                <Image src={fact.bannerImg} alt="" width={300} height={200} />
                            </div>
                            <ul>
                                {fact.personsInvolved.map((person) => (
                                    <li key={person.id}>{person.name}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="content">
                        <p>{fact.content}</p>
                        <ul>
                            {fact.personsInvolved.map((person) => (
                                <li key={person.id}>{person.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fact;
