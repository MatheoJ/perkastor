import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

interface FactChainProps {
  facts: {
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
  }[];
  onMoveFact: (factIndex: number, direction: 'up' | 'down') => void;
}

const FactChain: React.FC<FactChainProps> = ({ facts }) => {
  const [factList, setFactList] = useState(facts);

  const handleDeleteFact = (factIndex: number) => {
    const newFactList = [...factList];
    newFactList.splice(factIndex, 1);
    setFactList(newFactList);
  };

  return (
    <div className="factChain">
      {factList.map((fact, index) => (
        <div
          key={fact.id}
          className="factContainer"
        >
          <div className="factTitle">
            <img src={fact.bannerImg} alt="fact image" id='imageFactList' />
            <p>&thinsp;&thinsp;{fact.title} <br/> &thinsp;&thinsp;{fact.from}</p>
          </div>
          <div className='deleteBtn'>
            <button className="factActionBtn" onClick={() => handleDeleteFact(index)}>
            <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
      <div className="addFactBtn" onClick={() => window.location.href="/eventForm"}>
        <button className="factActionBtn">
          <Add />
        </button>
      </div>
    </div>
  );

};

export default FactChain;