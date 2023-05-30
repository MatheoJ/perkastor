import React, { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { type LngLat } from 'maplibre-gl';
import axios from "axios";

import { selectMapEvent } from "../events/map/SelectMapEvent";
import { bus } from "../utils/bus";

import "maplibre-gl/dist/maplibre-gl.css";
import { type NextPage } from "next";

interface MarkerProps {
  map: maplibregl.Map;
  lngLat?: [number, number];
}

const Marker: NextPage<MarkerProps> = ({ map, lngLat = [0, 0] }) => {
  const coordinates = React.useRef<HTMLPreElement | null>(null);

  const getPlaceInfo = async (latitude, longitude, zoom) => {

  let detail;
  
  if(zoom > 13){
    detail = 17;
  }
  else if(zoom> 8){
    detail = 10;
  }
  else if(zoom > 6){
    detail = 8;
  }
  else{
    detail = 5;
  }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${detail}&polygon_geojson=1`
      );

      if (response.data) {
        const name = response.data.display_name ;
        const geojson = response.data.geojson;
        return { name, geojson };
      }
      throw new Error('No response data');
    } catch (error) {
      console.error(error);
      return { name: 'Error fetching place info', geojson: null };
    }
  };

  useEffect(() => {
    if (!map) return;

    function onClick(lngLat: LngLat): void {
      coordinates.current.style.display = "block";
      coordinates.current.innerHTML = ` Coordonnées du clic : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat}`;

      void getPlaceInfo(lngLat.lat, lngLat.lng, Math.round(map.getZoom())).then((placeInfo) => {
        coordinates.current.innerHTML = `Coordonnées du clic : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat} <br /> ${placeInfo.name}`;
        
        if (placeInfo.geojson) {

          if (map.getLayer('place-boundary')) {
            map.removeLayer('place-boundary');
            map.removeSource('place-boundary'); // Remove the associated source as well
          }

          map.addSource('place-boundary', {
            type: 'geojson',
            data: placeInfo.geojson
          });
          
          map.addLayer({
            id: 'place-boundary',
            type: 'line',
            source: 'place-boundary',
            paint: {
              'line-color': '#f00',
              'line-width': 2
            }
          });
        }
      });
    }

    map.on("click", function(e) {
      onClick(e.lngLat);
      });

    return () => {
      map.off("click", onClick);
    };
  }, [map]);

  return (
    <div>
      <pre
        ref={coordinates}
        className="coordinates"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          position: "absolute",
          bottom: "40px",
          left: "10px",
          padding: "5px 10px",
          margin: 0,
          fontSize: "11px",
          lineHeight: "18px",
          borderRadius: "3px",
          display: "block",
        }}
      >
      </pre>
    </div>
  );
};

export default Marker;
