import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

interface MarkerProps {
  map: maplibregl.Map;
  lngLat?: [number, number];
}

const Marker: React.FC<MarkerProps> = ({ map, lngLat = [0, 0] }) => {
    const coordinates = React.useRef<HTMLPreElement | null>(null);


  useEffect(() => {
    if (!map) return;

    const markerElement = document.createElement('div');
    markerElement.className = 'marker';

    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([0, 0])
      .addTo(map);;
    
    function onDragEnd() {
        const lngLat = marker.getLngLat();
        coordinates.current.style.display = 'block';
        coordinates.current.innerHTML = 
        ` Coordonées du marker : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat}`;
    }

    marker.on('drag', onDragEnd);

    return () => {
      marker.remove();
    };
  }, [map]);

  return (
    <div>
      <pre ref={coordinates}
        className="coordinates"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          position: 'absolute',
          bottom: '40px',
          left: '10px',
          padding: '5px 10px',
          margin: 0,
          fontSize: '11px',
          lineHeight: '18px',
          borderRadius: '3px',
          display: 'block',
        }}
      >
        Déplacer le marqueur pour obtenir les coordonnées
        </pre>
    </div>
  );;
};

export default Marker;