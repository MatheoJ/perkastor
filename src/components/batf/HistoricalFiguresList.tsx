import React, { useEffect, useState } from 'react';
import HistoricalFigureView from "./HistoricalFiguresView";
import { Fact, HistoricalPerson } from '@prisma/client';
import Slider from 'react-slick';

interface HistoricalFigureListProps {
  historicalPersonList: HistoricalPerson []
}

const HistoricalFigureList: React.FC<HistoricalFigureListProps> = ( props) => {
  const { historicalPersonList } = props;

  
  const [visibleFigures, setVisibleFigures] = useState<number[]>([]);
  const [items, setItems] = useState(historicalPersonList.slice(0, 10));

  const [selectedFigures, setSelectedFigures] = useState([]);

  const handleFigureClick = (figure) => {
    if (selectedFigures.includes(figure)) {
      setSelectedFigures(selectedFigures.filter((f) => f !== figure));
    } else {
      setSelectedFigures([...selectedFigures, figure]);
    }
    if (selectedFigures.includes(figure)) {
      selectedFigures.forEach((element,index)=>{
        if(element==figure) selectedFigures.splice(index,1);
      });
      
    }
    console.log(selectedFigures)
    
  };



  useEffect(() => {
    // This effect will update the selectedFigure state whenever it changes
    selectedFigures.map(elem => {
      console.log('Selected figure in func: ', elem);
      return ;
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
};

export default HistoricalFigureList;
