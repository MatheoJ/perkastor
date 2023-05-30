import React, {  } from 'react';
import Slider from 'react-slick';
import { FactChainItemProps } from '../../types/types';
import { NextPage } from 'next';
import FactChainItem from './FactChainItem';
import { selectLocationItem } from '~/events/SelectSearchBarResultEvent';
import { bus } from '~/utils/bus';

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
  addBackArrow: boolean;
}

const ChainList: NextPage<ChainListProps> = ({ chain, setItemSelected, addBackArrow}) => {

  const handleChangeItem = (index: number) => {
    if(chain.items[index].fact.location){
      bus.publish(selectLocationItem(chain.items[index].fact.location));
    }
  }
  
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
    autoplay: false,
  };

  return (
    <div>
      {addBackArrow &&
      <div onClick={() => setItemSelected(null)} style={{cursor: "pointer"}} >
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      }
      
      <Slider className='sliderFactList' {...settings} afterChange={handleChangeItem}>
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
