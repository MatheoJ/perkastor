import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

interface DataPointsProps {
  map: maplibregl.Map;
}

const DataPoints: React.FC<DataPointsProps> = ({ map }) => {

  const highMagnitudeThreshold = 5.0;
  const zoomThreshold = 5;
    
  const updateEarthquakeFilter = () => {
    const currentZoom = map.getZoom();
    /* if (currentZoom < zoomThreshold) {
      map.setFilter('unclustered-point', [
        'all',
        ['!', ['has', 'point_count']],
        ['>=', ['get', 'mag'], highMagnitudeThreshold],
      ]);
    } else {
      map.setFilter('unclustered-point', ['!', ['has', 'point_count']]);
    } */

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
    

    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'earthquakes',
      filter: ['!', ['has', 'point_count']],
      paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
      }
    });

    map.on('click', 'unclustered-point', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var mag = e.features[0].properties.mag;
      var tsunami;
        
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

    useEffect(() => {
      // Update the filter when the map zoom changes
      map.on('zoom', updateEarthquakeFilter);
  
      // Cleanup event listener when component is unmounted
      return () => {
        map.off('zoom', updateEarthquakeFilter);
      };
    }, [map]);

  return null ;
};



export default DataPoints;