import React, { useEffect, useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { NextPage } from 'next';
import { ChainListProps, FactListProps, FactProps } from 'types/types';
import { Avatar, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

interface FactChainProps {
  facts: FactProps[];
  setFacts: React.Dispatch<React.SetStateAction<{}>>;
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

  const formatDate = (date: any) => {
    return (new Date(date)).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="chainListContributions">
      {facts.map((fact, index) => (
        <div
          key={fact.id}
          className="chainContainer"
        >
          <div className="chainTitle">
            <ImageWithFallback id='imageFactList' src={fact.bannerImg} alt="fact image" width={300} height={200} fallback='/resources/404-error.png' className='imageFactList' />

            <div className='chainContributionsTitleText'>
              <div className="left">
                <p><span className='strong'>{fact.title}</span></p>
                <ul className='no-margin date-container'>
                    {fact.keyDates.map((date, index) => {
                      return <li key={index}>{(new Date(date)).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</li>;
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
        <Link href="/eventForm">
          <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#40AC92' }} className='factActionBtn'>
            <Add />
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default FactChain;
