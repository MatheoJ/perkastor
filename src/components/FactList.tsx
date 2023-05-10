import React, { useEffect, useState } from 'react';
import Fact from './Fact';
import Slider from 'react-slick';
import { NextPage } from 'next';
import { FactListProps } from 'types/types';
import { getEarliestDate } from '~/lib/date-utils';


const FactList: NextPage<FactListProps> = ({ facts }) => {
  //const [visibleFacts, setVisibleFacts] = useState<number[]>([]);
  const [items, setItems] = useState(facts.slice(0, 10));

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(facts.slice(items.length, items.length + 10)));
    }, 1500);
  };
  console.log(facts[0])
  const sortedFacts = facts.sort((a, b) => Date.parse(getEarliestDate(a.keyDates)) - Date.parse(getEarliestDate(b.keyDates)));

  /*
    useEffect(() => {
      console.log('Visible facts:', visibleFacts);
    }, [visibleFacts]);
  */
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
    outerWidth: 100
    // autoplay: true,
  };


  return (
    <div>
      <Slider className='sliderFactList' {...settings} style={{ width: '300px' }}>
        {sortedFacts.map((fact) => (
          <div className='sortedFact' key={fact.id} style={{ width: '100%' }}>
            <Fact fact={fact} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FactList;
