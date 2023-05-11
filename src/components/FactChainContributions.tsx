import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Add from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Swal from 'sweetalert2';
import { NextPage } from 'next';
import Image from 'next/image';

interface FactChainContributionsProps {
  chain: {
    items: {
      fact: {
        id: string;
        createdAt: string;
        updatedAt: string;
        title: string;
        shortDesc?: string;
        content: string;
        keyDates: string[];
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
      },
      comment: string;
      id : string;
      position: number;
    }[];
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
  };
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
}

const FactChainContributions: NextPage<FactChainContributionsProps> = ({ chain, setItemSelected }) => {
  
  const updateFacts = (chain) => {
    const facts = chain.items.sort((a, b) => a.position - b.position).map((item) => item.fact);
    return facts;
  };

  const [facts, setFacts] = useState(updateFacts(chain));
  //trier les facts par position de l'item
  const handleMoveFact = async (currentIndex: number, newIndex: number) => {
    if(newIndex < 0 || newIndex >= facts.length || currentIndex === newIndex) {
      return;
    }
    const itemsToSwap = [chain.items[currentIndex].id, chain.items[newIndex].id];
    const chainItemIdsToSwapArray = JSON.stringify(itemsToSwap);
    const newChain = await fetch(`api/chain-items?chainItemIdsToSwapArray=${chainItemIdsToSwapArray}`, {
      method: 'PATCH',
    });
    if(newChain.status >=300) {
      setItemSelected(null);
      Swal.fire('Erreur', 'Une erreur est survenue lors de la modification de la chaîne', 'error');
      return;
    }
    const newChainJson = await newChain.json();
    setItemSelected(updateFacts(newChainJson));
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        var newChain = await fetch(`api/chain-items?chainItemId=${chain.items[factIndex].id}`, {
          method: 'DELETE',
        });
        if(newChain.status >=300) {
          setItemSelected(null);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'évènement', 'error');
          return;
        }
        newChain = await newChain.json();
        console.log("new chain", newChain);
        setItemSelected(newChain);
        setFacts(updateFacts(newChain));
        Swal.fire('Évènement supprimé', '', 'success');
      }
    });
  };

  return (
    <>
      <div className="factChainContributions">
        <div className="factChainHeader">
          <button className="returnBtn" onClick={() => setItemSelected(null)}>
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
                {<Image src={fact.bannerImg ? fact.bannerImg : "/images_default/perecastor.png"} alt="" width={200} height={100} />}
              <div className='factTitleText'> <p>{fact.title} <br /> {fact.keyDates.join(",")}</p> </div>
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
