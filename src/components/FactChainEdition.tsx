import React, { useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Swal from 'sweetalert2';
import {FactProps} from 'types/types';

interface FactChainEditionProps {
    facts: FactProps[];
}

const FactChainEdition = ({ facts }: FactChainEditionProps) => {
  //const [factsList, setFacts] = useState<FactProps[]>(facts);

  const handleMoveFact = (currentIndex: number, newIndex: number) => {
    const newFactList = [...facts];
    const movedFact = newFactList[currentIndex];
    newFactList.splice(currentIndex, 1);
    newFactList.splice(newIndex, 0, movedFact);
    
    facts = newFactList;
    //setFacts(newFactList);
  };

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

  const handleDeleteFact = async (factIndex: number) => {
    await Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet évènement ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
       if (result.isConfirmed) {
        console.log("avant suppression");
        console.log([...facts]);

        const newFactList = [...facts];
        newFactList.splice(factIndex, 1);
        console.log("après suppression");
        console.log(newFactList);
        
        facts = newFactList;
        console.log("after");
        console.log(facts);
        //setFacts(newFactList);

        await Swal.fire('Évènement supprimé', '', 'success');
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
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
          >
            <div className="factActions">
              <button className="factActionBtn" onClick={() => handleMoveFact(index, index - 1)}>
                <ArrowUpwardIcon />
              </button>
              <button className="factActionBtn" onClick={() => handleMoveFact(index, index + 1)}>
                <ArrowDownwardIcon />
              </button>
            </div>
            <div className="factTitle">
              <img src={fact.bannerImg} alt="fact image" id='imageFactList' />
              <div className='factTitleText'> 
                {(() => {
                    if (fact.title.length < 1) {
                        const date = fact.keyDates[0].slice(0,4);
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
              <button className="factActionBtn" onClick={() => handleDeleteFact(index)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

};

export default FactChainEdition;