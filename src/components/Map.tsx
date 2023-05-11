import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Marker from './Marker';
import FlyTo from './FlyTo';
import DataPoints from './DataPoints';
import 'maplibre-gl/dist/maplibre-gl.css';
import Batf from './batf/Batf';
import Button from './buttons/Button';
import DisplayLocation from './DisplayLocation';
import { bus } from '../utils/bus';
import { selectMapEvent } from '../events/map/SelectMapEvent';
import { selectLocationFromSearchBar } from '~/events/SelectSearchBarResultEvent';
import { LngLatLike } from 'maplibre-gl';
import { NextPage } from "next";

const MapTilerApiKey = process.env.MAPTILER_API_KEY;

interface MapPageProps {
  locationSelected : any;
  onLocationSelect : (locSelected : any) => void;  
}

const MapPage: NextPage<MapPageProps> = ({ locationSelected, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [idSelected, setIdSelected] = useState('');

  const handleSelectLocation = (location : any) => {
  };
  

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=KeNNPlHwOHbhaGFsVoos`,
      center: [2.3, 43.5],
      zoom: 4,
    });

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point_loc'] });
      if (!features.length) {
        bus.publish(selectMapEvent(null));
      }
    });

    map.on('load', () => {
        setMapInstance(map);
    });

    map.loadImage(
      'resources/pin_event.png',
      (error, image) => {
        if (error) throw error;
        map.addImage('pin_event', image);
      }
    );
    
    const unsub = bus.subscribe(selectLocationFromSearchBar, event => {
      const handlePayload = async () => {
        const payload = await Promise.resolve(event.payload);
        // @ts-ignore
        const endPoints: LngLatLike = [payload.longitude, payload.latitude]; // DO NOT MODIFY THIS LINE

        console.log(endPoints);

        map?.flyTo({
          center: endPoints,
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
      handlePayload().catch(error => {
        console.error("Error handling payload:", error);
      });
    });

    return () => {
      map.remove();
      unsub();
    };
  }, []);



  return (
      <div ref={mapContainer} className={'map-container'}>
        {mapInstance && <Marker map={mapInstance} />}
        {mapInstance && <FlyTo map={mapInstance} />}
        {mapInstance && <DisplayLocation map={mapInstance} locationSelected={locationSelected} onLocationSelect={handleSelectLocation}  />}
    </div>
  );
}

export default MapPage;

