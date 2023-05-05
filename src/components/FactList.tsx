import { useEffect, useRef, useState } from 'react';
import Card from './Card';

const FactList = ({ cards }) => {
  //display 5 cards at a time
  const [current, setCurrent] = useState(0);
  const [cardsToDisplay, setCardsToDisplay] = useState(cards.slice(0, 5));
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);

  const next = () => {
    setCurrent(current + 1);
    setCardsToDisplay(cards.slice(current + 1, current + 6));
    setIsPrevDisabled(false);
    if (current + 6 >= cards.length) {
      setIsNextDisabled(true);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    setCardsToDisplay(cards.slice(current - 1, current + 4));
    setIsNextDisabled(false);
    if (current - 1 <= 0) {
      setIsPrevDisabled(true);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={prev} disabled={isPrevDisabled}>Prev</button>
        <button onClick={next} disabled={isNextDisabled}>Next</button>
      </div>
      {cardsToDisplay.map((card) => (
        <Card key={card.id} title={card.title} description={card.description} />
      ))}
    </div>
  );
};

