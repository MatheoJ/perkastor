import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FactChainItem as FactChainItemType } from '@prisma/client'
import { Fact as FactType } from '@prisma/client'
import { FactChainItemProps } from '../../types/types'

interface Props {
    item: FactChainItemProps;
}

const Fact: React.FC<Props> = (props) => {
    const { item } = props;
    return (
        <div className="fact">
            <div className="factHead">
                <div className="factHeadTop">
                    <h1>{item.title}</h1>
                </div>
                <div className="factHeadBottom">
                    <div className="factHeadBottomLeft">
                        <li key={item.fact.location.id}>{item.fact.location.name}</li>
                    </div>
                    <div className="factHeadBottomRight">
                        <h2>
                            {item.fact.keyDates.map((date) => {
                                var dateObj = new Date(date);
                                return <li key={dateObj.getTime()}>{dateObj.getDate()} - {dateObj.getMonth()+1} - {dateObj.getFullYear()}</li>
                            })}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="factBody">
                <div className='content-left'>
                    <p>{item.fact.content}</p>
                </div>
                <div className='content-right'>
                    <div className="factImage">
                        {/*<Image src={fact.bannerImg} alt="" width={300} height={200} />*/}
                    </div>
                    <ul>
                        {item.fact.personsInvolved.map((person) => (
                            <li key={person.id}>{person.name}</li>
                        ))}
                    </ul>
                    <div className="comment">
                        <p>{item.comment}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fact;
