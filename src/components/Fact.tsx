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
                            19 mai 1952
                        </h2>
                    </div>
                </div>
            </div>
            <div className="factBody">
                <div className='content-left'>
                    <p>{fact.content}</p>
                </div>
                <div className='content-right'>
                    <div className="factImage">
                        {/*<Image src={fact.bannerImg} alt="" width={300} height={200} />*/}
                    </div>
                    <ul>
                        {fact.personsInvolved.map((person) => (
                            <li key={person.id}>{person.name}</li>
                        ))}
                    </ul>
                    
                </div>
            </div>
        </div>
    );
};

export default Fact;
