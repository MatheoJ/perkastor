import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Swal from 'sweetalert2';
import {type FactProps} from 'types/types';
import ImageWithFallback from './ImageWithFallback';
import { Alert, AlertTitle } from '@mui/material';
interface FactChainEditionProps {
    facts: FactProps[];
    setTmpFacts: React.Dispatch<React.SetStateAction<{}[]>>;
}

const FactChainEdition = ({ facts, setTmpFacts} : FactChainEditionProps) => {
  //const [factsList, setFacts] = useState<FactProps[]>(facts);

  const handleMoveFact = (currentIndex: number, newIndex: number) => {
    const newFactList = [...facts];
    const movedFact = newFactList[currentIndex];
    newFactList.splice(currentIndex, 1);
    newFactList.splice(newIndex, 0, movedFact);
    setTmpFacts(newFactList);
    //setFacts(newFactList);
  };

  const handleDeleteFact = async (factIndex: number) => {
    await Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
       if (result.isConfirmed) {

        const newFactList = [...facts];
        newFactList.splice(factIndex, 1);       
        setTmpFacts(newFactList);
        await Swal.fire('Événement supprimé', '', 'success');
      }
    });
  };

  console.log(facts);
  return (
    <>
      <div className="factChainEdition">
        {facts?.map((fact, index) => (
          <div
            key={fact.id}
            className="factContainer"
          >
            <div className="factActions">
              <button className="factActionBtn" onClick={(event) => {
                event.preventDefault();
                handleMoveFact(index, index - 1);}}>
                <ArrowUpwardIcon />
              </button>
              <button className="factActionBtn" onClick={(event) => {
                event.preventDefault();
                handleMoveFact(index, index + 1);}}>
                <ArrowDownwardIcon />
              </button>
            </div>
            <div className="factTitle">
            <ImageWithFallback src={fact.bannerImg} alt="" width={100} height={100} fallback='/resources/404-error.png' />
              <div className='factTitleText'> 
                {(() => {
                    if (fact.title.length < 1) {
                        const date = (fact.keyDates[0] as unknown as string).slice(0,4);
                        let content: string = fact.content;
        
                        if (fact.content.length > 30) {
                            content = fact.content.slice(0,30) + "...";
                        }
        
                        return `(${date}) - ${content}`;
                    } else {
                        return fact.title;
                    }
                })()}
                </div>
            </div>
            <div className='deleteBtn'>
              <button className="factActionBtn" onClick={(event) => {
                event.preventDefault();
                handleDeleteFact(index)}}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
        {
            facts.length === 0 ? 
            <Alert severity="warning">
                <AlertTitle>Attention</AlertTitle>
                Aucune tâche n'a été ajouté à la chaîne pour le moment.
            </Alert> : null
        }
      </div>
    </>
  );

};

export default FactChainEdition;