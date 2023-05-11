import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import {ChainListProps} from '../../types/types';
import { createDeflate } from 'zlib';

interface ChainListContributionsProps {
  chains: ChainListProps[];
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
  setChains: React.Dispatch<React.SetStateAction<{}[]>>;
}

const ChainListContributions: NextPage<ChainListContributionsProps> = ({ chains, setItemSelected, setChains}) => {

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
        if(newChain.status >=300) {
          setItemSelected(null);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de la chaine', 'error');
          return;
        }
        setChains(chains.filter((chain, index) => index !== chainIndex));
        Swal.fire('Chaine supprimée', '', 'success');
      }
    });
  };

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
            <img src={chain.image ? chain.image : "/images_default/perecastor.png"} alt="chain image" id='imageChainList' className='imageFactList' />
            <div className='chainTitleText'> <p>{chain.title} <br/> {chain.createdAt.split("T")[0]}</p> </div>
          </div>
          <div className='deleteBtn'>
            <button className="chainActionBtn" onClick={() => handleDeleteChain(index)}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
      <div className="addChainBtn" onClick={() => window.location.href="/chainForm"}>
        <button className="chainActionBtn">
          <Add />
        </button>
      </div>
    </div>
  );
};

export default ChainListContributions;
