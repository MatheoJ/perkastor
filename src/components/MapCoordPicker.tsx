// components/MapCoordPicker.tsx
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapCoordPickerProps {
  onMapClick: (longitude: number, latitude: number) => void;
}

const MapCoordPicker: React.FC<MapCoordPickerProps> = ({ onMapClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
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
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=KeNNPlHwOHbhaGFsVoos",
      center: [0, 0],
      zoom: 2,
    });

    map.on("click", function (e) {
      handleClick(e, map);
        
    });
  });
  return <div ref={mapContainer} style={{ width: "40vw", height: "40vh" }} />;
};

export default MapCoordPicker;
