import React, { useEffect, useState } from 'react';
import Fact from './Fact';
import Slider from 'react-slick';

interface FactListProps {
  facts: {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    shortDesc?: string;
    content: string;
    from?: string;
    until?: string;
    bannerImg?: string;
    verified: boolean;
    video: string[];
    audio: string[];
    author: {
      id: string;
      name: string;
    };
    tags: {
      id: string;
      name: string;
    }[];
    locations: {
      id: string;
      name: string;
    }[];
    personsInvolved: {
      id: string;
      name: string;
    }[];
  }[];
}

const FactList: React.FC<FactListProps> = ({ facts }) => {
  //const [visibleFacts, setVisibleFacts] = useState<number[]>([]);
  const [items, setItems] = useState(facts.slice(0, 10));

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(facts.slice(items.length, items.length + 10)));
    }, 1500);
  };

  const sortedFacts = facts.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());

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
    outerWidth:100
    // autoplay: true,
  };


  return (
    <div>
      <Slider className='sliderFactList' {...settings} style={{width: '300px'}}>
        {sortedFacts.map((fact) => (
          <div className='sortedFact' key={fact.id} style={{width: '100%'}}>
            <Fact fact={fact} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FactList;
