import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
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

  const handleMoveFact = (currentIndex: number, newIndex: number) => {
    const newFactList = [...factList];
    const movedFact = newFactList[currentIndex];
    newFactList.splice(currentIndex, 1);
    newFactList.splice(newIndex, 0, movedFact);
    setFactList(newFactList);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('index', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData('index'));
    if (draggedIndex !== index) {
      handleMoveFact(draggedIndex, index);
    }
  };

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
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
        >
          <div className="factActions">
            <button className="factActionBtn" onClick={() => handleMoveFact(index, index - 1)}>
              <ArrowUpwardIcon />
            </button>
            <button className="factActionBtn" onClick={() => handleMoveFact(index, index + 1)}>
              <ArrowDownwardIcon />
            </button>
          </div>
          <div className="factTitle">
            <p>{fact.title} <br/> {fact.from}</p>
          </div>
          <div className='deleteBtn'>
            <button className="factActionBtn" onClick={() => handleDeleteFact(index)}>
            <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
      <div className="addFactBtn" onClick={window.location.href="/eventForm"}>
        <button className="factActionBtn">
          <Add />
        </button>
      </div>
    </div>
  );

};

export default FactChain;
