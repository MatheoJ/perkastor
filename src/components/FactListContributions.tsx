import React, { useState } from 'react';
import Fact from './Fact';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Swal from 'sweetalert2';

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
  onMoveFact: (factIndex: number, direction: 'up' | 'down') => void;
}

const FactChain: React.FC<FactChainProps> = ({ facts }) => {
  const [factList, setFactList] = useState(facts);

  const handleDeleteFact = (factIndex: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // delete fact with delete request
        const res = await fetch(`api/facts?fid=${factList[factIndex].id}`, {
          method: 'DELETE',
        });
        
        if (!res) {
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'évènement', 'error');
          return;
        }
        const newFactList = [...factList];
        newFactList.splice(factIndex, 1);
        setFactList(newFactList);
        Swal.fire('Évènement supprimé', '', 'success');
      }
    });
  };

  return (
    <div className="factListContributions">
      {factList.map((fact, index) => (
        <div
          key={fact.id}
          className="factContainer"
        >
          <div className="factTitle">
          <img src={fact.bannerImg ? fact.bannerImg : "/images_home/image_default.jpg"} alt="fact image" id='imageFactList' />
            
            <div className='factTitleText'> <p>{fact.title} <br/> {fact.from}</p> </div>
          </div>
          <div className='deleteBtn'>
            <button className="factActionBtn" onClick={() => handleDeleteFact(index)}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
      <div className="addFactBtn" onClick={() => window.location.href="/eventForm"}>
        <button className="factActionBtn">
          <Add />
        </button>
      </div>
    </div>
  );
};

export default FactChain;
