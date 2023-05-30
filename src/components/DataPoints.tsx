import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import { NextPage } from 'next';

interface DataPointsProps {
  map: maplibregl.Map;
}

const DataPoints: NextPage<DataPointsProps> = ({ map }) => {

  const highMagnitudeThreshold = 5.0;
  const zoomThreshold = 5;
    
  const updateEarthquakeFilter = () => {
    const currentZoom = map.getZoom();

    if (currentZoom > 8) {
      map.setFilter('unclustered-point', ['!', ['has', 'point_count']]);
    } else {
      map.setFilter('unclustered-point', [
        'all',
        ['!', ['has', 'point_count']],
        ['>=', ['get', 'mag'], (8-currentZoom)/8*6],
      ]);
    }
  };


    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
     

    useEffect(() => {

      if (!map.getLayer('unclustered-point')) {
        map.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'earthquakes',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'pin_event',
            'icon-size': 0.2,
            'icon-allow-overlap': true,
          },
        });
      }

      // Update the filter when the map zoom changes
      map.on('zoom', updateEarthquakeFilter);
  
      // Cleanup event listener when component is unmounted
      return () => {
        map.off('zoom', updateEarthquakeFilter);
      };
    }, [map]);

    map.on('click', 'unclustered-point', function (e) {
      // @ts-ignore
      let coordinates = e.features[0].geometry.coordinates.slice(); // DO NOT MODIFY THIS LINE
      const mag = e.features[0].properties.mag;
      let tsunami;
        
      if (e.features[0].properties.tsunami === 1) {
      tsunami = 'yes';
      } else {
      tsunami = 'no';
      }
        
      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
        
      new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(
      'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
      )
      .addTo(map);
    });

  return null ;
};



export default DataPoints;