import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { type ChainListProps } from '../../types/types';
import { createDeflate } from 'zlib';
import { type NextPage } from 'next';
import { Avatar, Link } from '@mui/material';

interface ChainListContributionsProps {
  chains: ChainListProps[];
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
  setChains: React.Dispatch<React.SetStateAction<{}[]>>;
}

const ChainListContributions: NextPage<ChainListContributionsProps> = ({ chains, setItemSelected, setChains }) => {

  const handleDeleteChain = (chainIndex: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette chaine ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newChain = await fetch(`api/chains?id=${chains[chainIndex].id}`, {
          method: 'DELETE',
        });
        if (newChain.status >= 300) {
          setItemSelected(null);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de la chaine', 'error');
          return;
        }
        setChains(chains.filter((chain, index) => index !== chainIndex));
        Swal.fire('Chaine supprimée', '', 'success');
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
      {chains.map((chain, index) => (
        <div
          key={chain.id}
          className="chainContainer"

        >
          <div className="chainTitle" onClick={() => {
            setItemSelected(chain);
          }}>
            <img src={chain.image ? chain.image : "/resources/404-error.png"} alt="chain image" id='imageChainList' className='imageFactList' />
            <div className='chainContributionsTitleText'>
              <p><span className='strong'>{chain.title}</span>
                <br />
                <div className="date-container">
                  <li>
                    {formatDate(chain.createdAt)}
                  </li>
                </div>
              </p>
            </div>
          </div>
          <div className='deleteBtn'>
            <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#CB7A7A' }} onClick={() => handleDeleteChain(index)} className='chainActionBtn'>
              <DeleteIcon />
            </Avatar>
          </div>
        </div>
      ))}
      <div className='flex-center'>
        <Link href="/chainForm">
          <Avatar sx={{ width: 30, height: 30, color: '#fff', backgroundColor: '#40AC92' }}>
            <Add />
          </Avatar>
        </Link>
      </div>
    </div>
  );
};

export default ChainListContributions;
