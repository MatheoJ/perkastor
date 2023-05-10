import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import {ChainListProps} from '../../types/types';

interface ChainListContributionsProps {
  chains: ChainListProps[];
}

const ChainListContributions: React.FC<ChainListContributionsProps> = ({ chains }) => {
  const [chainList, setChainList] = useState(chains);

  const handleDeleteChain = (factIndex: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cette chaine ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const newChainList = [...chainList];
        newChainList.splice(factIndex, 1);
        setChainList(newChainList);
        Swal.fire('Chaine supprimée', '', 'success');
      }
    });
  };

  return (
    <div className="chainListContributions">
      {chainList.map((chain, index) => (
        <div
          key={chain.id}
          className="chainContainer"
        >
          <div className="chainTitle">
            <img src={chain.image} alt="chain image" id='imageChainList' />
            <div className='chainTitleText'> <p>{chain.title} <br/> {chain.createdAt.getDay()}-{chain.createdAt.getMonth()+1}-{chain.createdAt.getFullYear()}</p> </div>
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
