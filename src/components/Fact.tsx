import React from 'react';

interface FactProps {
    fact: {
        id: string;
        createdAt: string;
        updatedAt: string;
        title: string;
        shortDesc?: string;
        content: string;
        from?: string;
        until?: string;
        bannerImg?: string;
        verified: boolean;
        video: string[];
        audio: string[];
        author: {
            id: string;
            name: string;
        };
        tags: {
            id: string;
            name: string;
        }[];
        locations: {
            id: string;
            name: string;
        }[];
        personsInvolved: {
            id: string;
            name: string;
        }[];
    };
}

const Fact: React.FC<FactProps> = ({ fact }) => {
    return (
        <div className="fact">
            <div className="factHead">
                <div className="factHeadTop">
                    <h1>{fact.title}</h1>
                </div>
                <div className="factHeadBottom">
                    <div className="factHeadBottomLeft">
                        <h2>
                            {fact.locations.map((location) => (
                                <li key={location.id}>{location.name}</li>
                            ))
                            }

                        </h2>
                    </div>
                    <div className="factHeadBottomRight">
                        <h2>
                            Les dates de l'event
                        </h2>
                    </div>
                </div>
            </div>
            <div className="factBody">
                <p>{fact.content}</p>
                <ul>
                    {fact.personsInvolved.map((person) => (
                        <li key={person.id}>{person.name}</li>
                    ))}
                </ul>
                <ul>
                    {fact.tags.map((tag) => (
                        <li key={tag.id}>{tag.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Fact;
