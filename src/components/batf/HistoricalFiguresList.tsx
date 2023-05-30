import React, { useEffect, useState } from 'react';
import HistoricalFigureView from "./HistoricalFiguresView";
import { Fact, HistoricalPerson } from '@prisma/client';
import Slider from 'react-slick';
import { type PersonProps } from 'types/types';

interface HistoricalFigureListProps {
  historicalPersonList: PersonProps[];
  selectedFigures: any[];
  setSelectedFigures: (selectedFigures: any) => void;
}

const HistoricalFigureList: React.FC<HistoricalFigureListProps> = ({ historicalPersonList, selectedFigures, setSelectedFigures }) => {
  const [items, setItems] = useState(historicalPersonList.slice(0, 10));

  const handleFigureClick = (figure) => {
    if (Array.isArray(selectedFigures) && selectedFigures.length) {
      if (selectedFigures.includes(figure)) {
        setSelectedFigures(selectedFigures.filter((f) => f !== figure));
      } else {
        setSelectedFigures([...selectedFigures, figure]);
      }
      if (selectedFigures.includes(figure)) {
        selectedFigures.forEach((element, index) => {
          if (element == figure) selectedFigures.splice(index, 1);
        });
      }
    } else {
      setSelectedFigures([]);
    }
    console.log(selectedFigures)
  };

  useEffect(() => {
    // This effect will update the selectedFigure state whenever it changes
    selectedFigures.map(elem => {
      console.log('Selected figure in func: ', elem);
      return;
    })
  });


  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(historicalPersonList.slice(items.length, items.length + 10)));
    }, 1500);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    horizontal: true,
    horizontalSwiping: true,
    swipeToSlide: true,
    centerMode: true,
    arrows: true,
  };

  if (historicalPersonList.length === 1) {
    return (
      <div className='sortedFigure'>
        <div className='figureClickable'>
          <HistoricalFigureView historicalPerson={historicalPersonList[0]} />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Slider className='sliderFigureList' {...settings}>
          {historicalPersonList.map((figure) => (
            <div
              className={`sortedFigure ${selectedFigures.includes(figure) ? 'selected' : ''}`}
              key={figure.id}
              onClick={() => handleFigureClick(figure)}
            >
              <div className='figureClickable'>
                <HistoricalFigureView historicalPerson={figure} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
};

export default HistoricalFigureList;
