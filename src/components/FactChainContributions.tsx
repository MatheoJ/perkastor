import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Add from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Swal from 'sweetalert2';
import { NextPage } from 'next';
import { ChainListProps, FactProps } from 'types/types';

interface FactChainContributionsProps {
  chain?: ChainListProps;
  facts?: FactProps[];
  setFacts?: React.Dispatch<React.SetStateAction<{}[]>>;
}

const FactChainContributions: NextPage<FactChainContributionsProps> = ({ chain, facts, setFacts }) => {
  if (chain) {
    [facts, setFacts] = useState(chain[0].facts);
  }

  const handleMoveFact = async (currentIndex: number, newIndex: number) => {
    await fetch(`api/chains&`)
    const newFactList = [...facts];
    const movedFact = newFactList[currentIndex];
    newFactList.splice(currentIndex, 1);
    newFactList.splice(newIndex, 0, movedFact);
    setFacts(newFactList);
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
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const newFactList = [...facts];
        newFactList.splice(factIndex, 1);
        setFacts(newFactList);
        Swal.fire('Évènement supprimé', '', 'success');
      }
    });
  };

  return (
    <>
      <div className="factChainContributions">
        <div className="factChainHeader">
          <button className="returnBtn">
            <ArrowBackIcon />
          </button>
          <h3>&thinsp;Chaîne d'évènements</h3>
        </div>
        {facts.map((fact, index) => (
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
              <img src={fact.bannerImg} alt="fact image" id='imageFactList' />
              <div className='factTitleText'> <p>{fact.title} <br /> {fact.keyDates.join(', ')}</p> </div>
            </div>
            <div className='deleteBtn'>
              <button className="factActionBtn" onClick={() => handleDeleteFact(index)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
        <div className="addFactBtn" onClick={() => window.location.href = "/eventForm"}>
          <button className="factActionBtn">
            <Add />
          </button>
        </div>
      </div>
    </>
  );

};

export default FactChainContributions;
