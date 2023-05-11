// components/MapCoordPicker.tsx
import React, { useEffect, useRef, useState } from "react";
import DisplayLocation from "./DisplayLocation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapCoordPickerProps {
  onMapClick: (longitude: number, latitude: number) => void;
  locSelected : any;
  onLocationSelect : (locSelected : any) => void;  
}

const MapCoordPicker: NextPage<MapCoordPickerProps> = ({ onMapClick, locSelected, onLocationSelect }) => {
  const mapContainer2 = useRef<HTMLDivElement>(null);
  const [mapInstance2, setMapInstance2] = useState<maplibregl.Map>(null);
  const image = useRef<maplibregl.Marker>(null);


  const handleClick = (event: any, map:maplibregl.Map) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;

    onMapClick(longitude, latitude);

    if (image.current) {
        image.current.remove();
      }

    // create a new image at the clicked location
    image.current = new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);
  };

  useEffect(() => {
    if (!mapContainer2.current) return;

    const map2 = new maplibregl.Map({
      container: mapContainer2.current,
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=KeNNPlHwOHbhaGFsVoos",
        center: [2.3, 43.5],
        zoom: 4,
    });
    
    map2.on('load', () => {
      setMapInstance2(map2);
    });

    map2.loadImage(
      'resources/pin_event.png',
      (error, image) => {
        if (error) throw error;
        map2.addImage('pin_event', image);
      }
    );
  

    map2.on('click', function(e) {
      var features = map2.queryRenderedFeatures(e.point, { layers: ['unclustered-point_loc'] });
      if (!features.length) {
        handleClick(e, map2);
      }
    });
  
    
  },[]);

  return <div className = "mapstyle" ref={mapContainer2} style={{ width: "800px", height: "500px" }} >
            {mapInstance2 && <DisplayLocation map={mapInstance2} locationSelected={locSelected} onLocationSelect={onLocationSelect} /> }
        </div>;
};

export default MapCoordPicker;
