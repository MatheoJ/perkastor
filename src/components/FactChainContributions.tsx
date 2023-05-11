import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Add from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Swal from 'sweetalert2';
import { NextPage } from 'next';
import Image from 'next/image';
import { ChainListProps } from 'types/types';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import ImageWithFallback from './ImageWithFallback';

interface FactChainContributionsProps {
  chain: ChainListProps,
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
  setChangedChain: React.Dispatch<React.SetStateAction<string>>;
}

const FactChainContributions: NextPage<FactChainContributionsProps> = ({ chain, setItemSelected, setChangedChain }) => {

  const updateFacts = (chain) => {
    var facts = chain.items.sort((a, b) => a.position - b.position).map((item) => item.fact);
    console.log("facts", facts);
    return facts;
  };

  const [facts, setFacts] = useState(updateFacts(chain));
  //trier les facts par position de l'item
  const handleMoveFact = async (currentIndex: number, newIndex: number) => {
    if (newIndex < 0 || newIndex >= facts.length || currentIndex === newIndex) {
      return;
    }
    const itemsToSwap = [chain.items[currentIndex].id, chain.items[newIndex].id];
    const chainItemIdsToSwapArray = JSON.stringify(itemsToSwap);
    const newChain = await fetch(`api/chain-items?chainItemIdsToSwap=${chainItemIdsToSwapArray}`, {
      method: 'PATCH',
    });
    if (newChain.status >= 300) {
      setItemSelected(null);
      Swal.fire('Erreur', 'Une erreur est survenue lors de la modification de la chaîne', 'error');
      return;
    }
    const newChainJson = await newChain.json();
    if (newChainJson) {
      console.log("new chain", newChainJson.data);
      setItemSelected(newChainJson.data);
      //setRemovedChainItemId(newChainJson.data.items[currentIndex].id);
      setFacts(updateFacts(newChainJson.data));
    }
  };
  /*
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
  */
  const handleDeleteFact = (factIndex: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette anecdote historique ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        var newChain = await fetch(`api/chain-items?chainItemId=${chain.items[factIndex].id}`, {
          method: 'DELETE',
        });
        if (newChain.status >= 300) {
          setItemSelected(null);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'anecdote historique', 'error');
          return;
        }
        newChain = await newChain.json();
        if (newChain) {
          setItemSelected(newChain.data);
          setFacts(updateFacts(newChain.data));
          setChangedChain(newChain.data);
        }
        Swal.fire('Anecdote historique supprimée', '', 'success');
      }
    });
  };

  const describeFactTitle = (fact: any): string => {
    if (fact.title.length < 1) {
      const date = fact.keyDates[0].slice(0, 4);
      let content: string = fact.content;

      if (fact.content.length > 30) {
        content = fact.content.slice(0, 30) + "...";
      }

      return `(${date}) -${content}`;
    }
    return fact.title;
  }
  const getDate = (date: any) => {
    const dateObj =new Date(date);
    if(dateObj.toLocaleDateString().split('/')[1] === '01' && dateObj.toLocaleDateString().split('/')[0] === '01'){
      return dateObj.getFullYear();
    }
    return dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' });
  }
  return (
    <div className="chainListContributions">
      <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#40AC92' }} className='arrow-back' onClick={() => setItemSelected(null)}>
        <ArrowBackIcon />
      </Avatar>
      {facts.map((fact, index) => (
        <div
          key={fact.id}
          className="factChainContainer"
        >
          <div className="chainTitle">
            <div className="factActionsAbsolute">
              <Avatar sx={{ width: 24, height: 24, color: '#333', backgroundColor: '#fff' }} onClick={() => handleMoveFact(index, index - 1)} className='arrow-up'>
                <ArrowUpwardIcon />
              </Avatar>
              <Avatar sx={{ width: 24, height: 24, color: '#333', backgroundColor: '#fff' }} onClick={() => handleMoveFact(index, index + 1)} className='arrow-down'>
                <ArrowDownwardIcon />
              </Avatar>
            </div>

            <ImageWithFallback id='imageFactList' src={fact.bannerImg} alt="fact image" width={300} height={200} fallback='/resources/404-error.png' className='imageFactList' />

            <div className='chainContributionsTitleText'>
              <div className="left">
                <p><span className='strong'>{describeFactTitle(fact)}</span></p>
                <ul className='no-margin date-container'>
                  {fact.keyDates.map((date, index) => {
                    return <li key={index}>{getDate(date)}</li>;
                  })}
                </ul>
              </div>
              <div className="right flex-center">
                <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#CB7A7A' }} onClick={() => handleDeleteFact(index)} className='factActionBtn'>
                  <DeleteIcon />
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='flex-center'>
        <Link href="/chainForm">
          <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#40AC92' }} className='factActionBtn'>
            <Add />
          </Avatar>
        </Link>
      </div>
    </div>


  );

};

export default FactChainContributions;
