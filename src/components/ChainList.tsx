import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { ChainListProps } from '../../types/types';
import { createDeflate } from 'zlib';
import { NextPage } from 'next';
import { Avatar } from '@mui/material';

interface ChainListContributionsProps {
  chains: ChainListProps[];
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
}

const ChainListContributions: NextPage<ChainListContributionsProps> = ({ chains, setItemSelected }) => {

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
          onClick={() => setItemSelected(chain)}
        >
          <div className="chainTitle">
            <img src={chain.image ? chain.image : "/images_default/perecastor.png"} alt="chain image" id='imageChainList' className='imageFactList' />
            <div className='chainTitleText'>
              <div className="left">
                <div><p><span className='strong'>{chain.title}</span></p>
                  <div className='author'>
                    <Avatar alt={chain.author.name} src={chain.author.image} /><p>{chain.author.name}</p>
                  </div>
                </div>
              </div>
              <div className='right'>
                <div className="date-container">
                  <li>
                    {formatDate(chain.createdAt)}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
      }
    </div >
  );
};
export default ChainListContributions;
