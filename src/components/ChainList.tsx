import React, { useEffect, useState } from 'react';
import FactChainItem from './FactChainItem';
import Slider from 'react-slick';
import { FactChainItem as FactChainItemType } from '@prisma/client';
import { FactChain } from '@prisma/client';
import { FactChainItemProps } from '../../types/types';

interface ChainListProps {
  facts: FactChainItemProps[];
}

const ChainList: React.FC<ChainListProps> = ({ facts }) => {
  console.log('Facts:', facts);
  const [visibleFacts, setVisibleFacts] = useState<number[]>([]);
  const [items, setItems] = useState(facts.slice(0, 10));

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(facts.slice(items.length, items.length + 10)));
    }, 1500);
  };

  useEffect(() => {
    console.log('Visible facts:', visibleFacts);
  }, [visibleFacts]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    horizontal: true,
    horizontalSwiping: true,
    swipeToSlide: true,
    arrows: false,
    variableWidth: false,
    outerWidth: 100,
    autoplay: true,
  };

  return (
    <div>
      <Slider className='sliderFactList' {...settings} style={{width: '300px'}}>
        {facts.map((fact) => (
          <div className='sortedFact' key={fact.id} style={{width: '100%'}}>
            <FactChainItem item={fact} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ChainList;
