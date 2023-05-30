import React, { useEffect, useRef } from 'react';
import { type LngLatLike } from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import { type NextPage } from 'next';


interface FlyToProps {
  map: maplibregl.Map;
  lngLat?: [number, number];
}

const FlyTo: NextPage<FlyToProps> = ({ map, lngLat = [0, 0] }) => {

    const end: LngLatLike = [2.3160431, 48.7791939 ];    

    const handleButtonClick = () => {
        if (!map) return;
        map.flyTo({
            // These options control the ending camera position: centered at
            // the target, at zoom level 9, and north up.
            center: end,
            zoom: 15,
            bearing: 0,
                
            speed: 1.5, // make the flying slow
            curve: 1, // change the speed at which it zooms out
                
            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: function (t) {
            return t;
            },                
            // this animation is considered essential with respect to prefers-reduced-motion
            essential: true
            });
    };

  return (
    <div>
      <button onClick={handleButtonClick} style={{
          background: 'rgba(255, 0, 0, 0.5)',
          color: '#fff',
          position: 'absolute',
          bottom: '110px',
          left: '10px',
          padding: '5px 10px',
          margin: 0,
          fontSize: '11px',
          lineHeight: '18px',
          borderRadius: '3px',
          display: 'block',
        }}>Voler à Bourg La Reine</button>
    </div>
  );
};

export default FlyTo;