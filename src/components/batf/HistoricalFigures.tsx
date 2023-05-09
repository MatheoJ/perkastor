import React, { useEffect, useState } from 'react';
import Image from 'next/image';


interface HistoricalFigureProps {
    historicalFigure: {
        id: string;
        name: string;
        birthDate?: string;
        deathDate?: string;
        image?: string;
        shortDesc?: string;
        content?: string;
    };
}



const HistoricalFigure: React.FC<HistoricalFigureProps> = ({ historicalFigure }) => {

    return (
        <div className="historicalFigure">
            <div className="historicalFigureHead">
                <div className="historicalFigureHeadTop">
                    <h1>{historicalFigure.name}</h1>
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
                        <h2>
                            <p>{historicalFigure.birthDate.split('T',1)}</p>
                            <p>{historicalFigure.deathDate.split('T',1)}</p>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="historicalFigureBody">
                <div className='content-left'>
                    <p>{historicalFigure.shortDesc}</p>
                    <p>{historicalFigure.content}</p>
                </div>
                <div className='content-right'>
                    <div className="historicalFigureImage">
                        <Image src={historicalFigure.image} alt="" width={300} height={200} />
                    </div>
                    {/* <ul>
                        {historicalFigure.personsInvolved.map((person) => (
                            <li key={person.id}>{person.name}</li>
                        ))}
                    </ul>
                    <ul>
                        {fact.tags.map((tag) => (
                            <li key={tag.id}>{tag.name}</li>
                        ))}
                    </ul> */}
                </div>
            </div>
        </div>
    );
};

export default HistoricalFigure;
