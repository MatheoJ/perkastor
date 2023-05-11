import React, { useEffect, useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { NextPage } from 'next';

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
  setFacts: React.Dispatch<React.SetStateAction<{}[]>>;
}

const FactChain: NextPage<FactChainProps> = ({ facts, setFacts }) => {

  const handleDeleteFact = (factIndex: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette anecdote historique ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // delete fact with delete request
        const res = await fetch(`api/facts?fid=${facts[factIndex].id}`, {
          method: 'DELETE',
        });

        if (res.status >= 300) {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'anecdote historique', 'error');
          return;
        }
        const newFactList = [...facts];
        newFactList.splice(factIndex, 1);
        setFacts(newFactList);
        Swal.fire('Anecdote historique supprimée', '', 'success');
      }
    });
  };

  return (
    <div className="factListContributions">
      {facts.map((fact, index) => (
        <div
          key={fact.id}
          className="factContainer"
        >
          <div className="factTitle">
            <img src={fact.bannerImg ? fact.bannerImg : "/images_default/perecastor.png"} alt="fact image" id='imageFactList' className='imageFactList' />

            <div className='factTitleText'> <p>{fact.title} <br /> {fact.from}</p> </div>
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
  );
};

export default FactChain;
