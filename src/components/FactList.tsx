import React, { useEffect, useState } from 'react';
import Fact from './Fact';
import Slider from 'react-slick';
import { NextPage } from 'next';
import { FactListProps } from 'types/types';
import { getEarliestDate } from '~/lib/date-utils';


const FactList: NextPage<FactListProps> = ({ facts }) => {
  const sortedFacts = facts.sort((a, b) => Date.parse(getEarliestDate(a.keyDates)) - Date.parse(getEarliestDate(b.keyDates)));

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
    <>
      <Slider className='sliderFactList' {...settings}>
        {sortedFacts.map((fact) => (
          <div className='sortedFact' key={fact.id} style={{ width: '100%' }}>
            <Fact fact={fact} />
          </div>
        ))}
      </Slider>
    </>
  );
};

export default FactList;
