import React, {  } from 'react';
import Image from 'next/image';
import { type FactChainItemProps } from '../../types/types'
import { type NextPage } from 'next';
interface Props {
    item: FactChainItemProps;
}

const Fact: NextPage<Props> = (props) => {
    const { item } = props;

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        if (date.getFullYear() === 1 || date.getFullYear() === 4) {
            return 'N/A'
        }
        if(date.toDateString().split(' ')[1] === 'Jan' && date.toDateString().split(' ')[2] === '01' && date.getFullYear() === 1970) {
            return 'N/A'
        }
        if(date.toDateString().split(' ')[1] === 'Jan' && date.toDateString().split(' ')[2] === '01') {
            return date.getFullYear().toString();
        }
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <div className="fact">
            <div className="factHead">
                <div className="factHeadTop">
                    <h1 className="mark">{item.title}</h1>
                </div>
                <div className="factHeadBottom">
                    <div className="factHeadBottomLeft">
                        <li key={item.fact.location.id}><span className='text-bold'>{item.fact.location.name}</span></li>
                    </div>
                    <div className="factHeadBottomRight">
                        <div className="date-container">
                            {item.fact.keyDates.map((keyDate) => (
                                <li >{formatDate(keyDate as unknown as string)}</li>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="factBody">
                <div className='content-left'>
                    <p>{item.fact.content}</p>
                </div>
                <div className='content-right'>
                    <div className="factImage">
                        {<Image key={item.fact.bannerImg} src={item.fact.bannerImg ? item.fact.bannerImg :  "/resources/404-error.png"} alt="" width={300} height={200} />}
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
