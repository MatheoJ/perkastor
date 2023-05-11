import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { ChainListProps } from '../../types/types';
import { createDeflate } from 'zlib';
import { NextPage } from 'next';
import { Avatar } from '@mui/material';
import ImageWithFallback from './ImageWithFallback';

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
            <ImageWithFallback id='imageFactList' src={chain.image} alt="fact image" width={300} height={200} fallback='/resources/404-error.png' className='imageFactList' />
            <div className='chainTitleText'>
              <div className="left">
                <div><p><span className='strong'>{chain.title}</span></p>
                  {chain.author ?
                    <div className='author'>
                      <Avatar alt={chain.author.name} src={chain.author.image} /><p>{chain.author.name}</p>
                    </div> : null
                  }
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
