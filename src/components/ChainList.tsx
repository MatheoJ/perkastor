import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';
import { ChainListProps } from '../../types/types';
import { createDeflate } from 'zlib';
import { NextPage } from 'next';

interface ChainListContributionsProps {
  chains: ChainListProps[];
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
}

const ChainListContributions: NextPage<ChainListContributionsProps> = ({ chains, setItemSelected}) => {
  return (
    <div className="chainListContributions">
      {chains.map((chain, index) => (
        <div
          key={chain.id}
          className="chainContainer"
          onClick={() => setItemSelected(chain)}
        >
          <div className="chainTitle">
            <img src={chain.image ? chain.image : "images_default/perecastor.png"} alt="chain image" id='imageChainList' className='imageFactList' />
            <div className='chainTitleText'> <p>{chain.title} <br /> {chain.createdAt.toString().split("T")[0]}</p> </div>
          </div>
        </div>
      ))}
      </div>
  );
};
export default ChainListContributions;
