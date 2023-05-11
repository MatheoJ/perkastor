import React, { useEffect, useState, useRef } from 'react';
import Fact from './Fact';
import Slider from 'react-slick';
import { NextPage } from 'next';
import { FactListProps } from 'types/types';
import { getEarliestDate } from '~/lib/date-utils';


const FactList: NextPage<FactListProps> = ({ facts, lastSlide, setLastSlide }) => {

  const sortedFacts = facts.sort((a, b) => Date.parse(getEarliestDate(a.keyDates)) - Date.parse(getEarliestDate(b.keyDates)));

  const sliderRef = useRef(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: current => setLastSlide(current),
    initialSlide: lastSlide,
  };

  return (
    <Slider ref={sliderRef} {...settings}>
      {sortedFacts.map((fact, index) => (
        <div className='sortedFact' key={fact.id} style={{ width: '100%' }}>
          <Fact fact={fact}/>
        </div>
      ))}
    </Slider>
  );
};

export default FactList;