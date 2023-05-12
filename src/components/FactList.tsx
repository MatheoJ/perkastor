import React, { useState } from 'react';
import Fact from './Fact';
import Slider from 'react-slick';
import { NextPage } from 'next';
import { FactListProps } from 'types/types';
import { getEarliestDate } from '~/lib/date-utils';
import { Slider as RangeSlider } from '@material-ui/core';
import moment from 'moment';
import BatfNoMarkerSelected from './batf/BatfNoMarkerSelected';

const FactList: NextPage<FactListProps> = ({ facts, lastSlide, setLastSlide }) => {
  const [dateRange, setDateRange] = useState([0, 100]); // initial range
  const sliderRef = React.useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: current => setLastSlide(current),
    initialSlide: lastSlide,
  };

  const displayFacts = facts.sort((a, b) => Date.parse(getEarliestDate(a.keyDates)) - Date.parse(getEarliestDate(b.keyDates)));

  const sortedFacts = displayFacts.filter(fact => new Date(getEarliestDate(fact.keyDates)).getFullYear() !== 1);

  // Convert slider percentage to date
  const convertToDate = (value, endOfDay = false) => {
    const startDate = moment(getEarliestDate(sortedFacts[0].keyDates));
    const endDate = moment(getEarliestDate(sortedFacts[sortedFacts.length - 1].keyDates));
    const date = startDate.add(Math.ceil((endDate.diff(startDate, 'days') * value) / 100), 'days');
    return endOfDay ? date.endOf('day').toDate() : date.toDate();
  }

  const filteredFacts = displayFacts.filter(fact => {
    const date = new Date(getEarliestDate(fact.keyDates));
    return date >= convertToDate(dateRange[0]) && date <= convertToDate(dateRange[1], true);
  });

  return (
    <>
      <div style={{ position: 'relative', transform:"translateY(-80%)" }}>
        <div className='slider'>
          <RangeSlider value={dateRange} onChange={(event, newValue) => setDateRange(newValue)} style={{ color: "white" }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          width: '70%',
          top: '20px', // Adjust as needed
          left: '15%', // Adjust as needed
        }}>
          <div>{convertToDate(dateRange[0]).toLocaleDateString()}</div>
          <div>{convertToDate(dateRange[1]).toLocaleDateString()}</div>
        </div>
      </div>
      {filteredFacts.length === 0 ?
        <BatfNoMarkerSelected name={'Aucune anecdote pour cette période'} />
        :
        <Slider ref={sliderRef} {...settings}>
          {filteredFacts.map((fact, index) => (
            <div className='sortedFact' key={fact.id} style={{ width: '100%' }}>
              <Fact fact={fact} />
            </div>
          ))}
        </Slider>
      }
    </>
  );
};

export default FactList;
