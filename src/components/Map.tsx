/* export default function MapPage() {
    return <div>About us</div>
} */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Marker from './Marker';
import FlyTo from './FlyTo';
import DataPoints from './DataPoints';
import 'maplibre-gl/dist/maplibre-gl.css';
import Batf from './batf/Batf';
import Button from './buttons/Button';
import DataPoints2 from './DataPoints2';

const MapTilerApiKey = process.env.MAPTILER_API_KEY;

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=KeNNPlHwOHbhaGFsVoos',
      center: [0, 0],
      zoom: 2,
    });

    map.on('load', () => {
        setMapInstance(map);
        map.addSource('earthquakes', {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: 'https://maplibre.org/maplibre-gl-js-docs/assets/earthquakes.geojson',
            cluster: false
        });

    });

    map.loadImage(
      'resources/pin_event.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('pin_event', image);
      }
    );

    return () => {
      map.remove();
    };
  }, []);



  return (
      <div ref={mapContainer} className={'map-container'}>
        {mapInstance && <Marker map={mapInstance} />}
        {mapInstance && <FlyTo map={mapInstance} />}
        {mapInstance && <DataPoints map={mapInstance} />}
        {mapInstance && <DataPoints2 map={mapInstance} />}
    </div>
  );
}
