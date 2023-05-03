import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { LngLat } from 'maplibre-gl';
import axios from "axios";

import "maplibre-gl/dist/maplibre-gl.css";

interface MarkerProps {
  map: maplibregl.Map;
  lngLat?: [number, number];
}

const Marker: React.FC<MarkerProps> = ({ map, lngLat = [0, 0] }) => {
  const coordinates = React.useRef<HTMLPreElement | null>(null);

  const getPlaceInfo = async (latitude, longitude, zoom) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&polygon_geojson=1`
      );

      console.log('https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&polygon_geojson=1');
      
      if (response.data) {
        console.log(response.data);
        const name = response.data.display_name ;
        const geojson = response.data.geojson;
        console.log(name);
        console.log(geojson);
        
        return { name, geojson };
      } else {
        throw new Error('No response data');
      }
    } catch (error) {
      console.error(error);
      return { name: 'Error fetching place info', geojson: null };
    }
  };

  useEffect(() => {
    if (!map) return;

    const markerElement = document.createElement("div");
    markerElement.className = "marker";

    const marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([0, 0])
      .addTo(map);

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      coordinates.current.style.display = "block";      
      coordinates.current.innerHTML = ` Coordonées du marker : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat}`;
      getPlaceInfo(lngLat.lat, lngLat.lng, Math.round(map.getZoom())).then((placeName) => {
        coordinates.current.innerHTML = `Coordonées du marker : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat} <br /> ${placeName}`;
      });
    }

    function onClick(lngLat: LngLat): void {
      coordinates.current.style.display = "block";
      coordinates.current.innerHTML = ` Coordonées du marker : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat}`;

      getPlaceInfo(lngLat.lat, lngLat.lng, Math.round(map.getZoom())).then((placeInfo) => {
        coordinates.current.innerHTML = `Coordonées du marker : <br /> Longitude: ${lngLat.lng}<br /> Latitude: ${lngLat.lat} <br /> ${placeInfo.name}`;
        
        console.log('placeName :');
        console.log(placeInfo.name);
        console.log('geojson :');
        console.log(placeInfo.geojson);
        
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

    //marker.on("dragend", onDragEnd);

    map.on("click", function(e) {
      onClick(e.lngLat);
      });

    return () => {
      marker.remove();
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
        Déplacer le marqueur pour obtenir les coordonnées
      </pre>
    </div>
  );
};

export default Marker;
