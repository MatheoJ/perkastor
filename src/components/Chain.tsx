import React, { useEffect, useState } from 'react';
import FactChainItem from './FactChainItem';
import Slider from 'react-slick';
import { FactChainItem as FactChainItemType } from '@prisma/client';
import { FactChain } from '@prisma/client';
import { FactChainItemProps } from '../../types/types';

interface ChainListProps {
  chain: {title :string,
          items: FactChainItemProps[],
          description: string,
          createdAt: string,
          updatedAt: string,
          image: string,
          visibility: string,
          author : {
            name: string,
          }
        }
  setItemSelected: React.Dispatch<React.SetStateAction<{}>>;
}

const ChainList: React.FC<ChainListProps> = ({ chain, setItemSelected }) => {
  console.log('chain', chain)
  //const [visibleFacts, setVisibleFacts] = useState<number[]>([]);
  //const [items, setItems] = useState(facts.slice(0, 10));
  /*
  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(facts.slice(items.length, items.length + 10)));
    }, 1500);
  };*/

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
      <div onClick={() => setItemSelected(null)} style={{cursor: "pointer"}} >
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      
      <Slider className='sliderFactList' {...settings} style={{width: '300px'}}>
        {chain.items.map((item) => (
          <div className='sortedFact' key={item.id} style={{width: '100%'}}>
            <FactChainItem item={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ChainList;
