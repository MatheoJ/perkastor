import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MongoClient } from "mongodb";
import "maplibre-gl/dist/maplibre-gl.css";
import { selectMapEvent } from "../events/map/SelectMapEvent";
import { bus } from "../utils/bus";
interface DisplayLocationProps {
  map: maplibregl.Map;
  locationSelected: any;
  onLocationSelect: (locSelected: any) => void;
}

const DisplayLocation: React.FC<DisplayLocationProps> = ({ map, locationSelected, onLocationSelect }) => {

  const updateLocation = async () => {

    const queryParams = new URLSearchParams({
      type: map.getZoom().toString(),
      maxLongitude: map.getBounds()._ne.lng.toString(),
      maxLatitude: map.getBounds()._ne.lat.toString(),
      minLongitude: map.getBounds()._sw.lng.toString(),
      minLatitude: map.getBounds()._sw.lat.toString(),
    });

    const response = await fetch(`/api/locations?${queryParams}`, {
      method: "GET",
    });

    if (response.status === 200) {
      // Check if the response status is 200
      const responseData = await response.json();
      console.log(responseData);

      if (map.getLayer("unclustered-point_loc")) {
        map.removeLayer("unclustered-point_loc");
        map.removeSource("dataLoc"); // Remove the associated source as well
      }

      map.addSource("dataLoc", {
        type: "geojson",
        data: responseData,
        cluster: false,
      });

      map.addLayer({
        id: "unclustered-point_loc",
        type: "symbol",
        source: "dataLoc",
        layout: {
          "icon-image": "pin_event",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
        },
      });
    }
  };

  useEffect(() => {

    map.on("zoomend", updateLocation);
    map.on("moveend", updateLocation);

    map.on('click', 'unclustered-point_loc', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice(); // DO NOT MODIFY THIS LINE
      var name = e.features[0].properties.name;

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          'Nom: ' + name
        )
        .addTo(map);

      bus.publish(selectMapEvent(e.features[0]));
      onLocationSelect(e.features[0]);

    });

    // Cleanup event listener when component is unmounted
    return () => {
      map.off("zoomend", updateLocation);
      map.off("zoomend", updateLocation);
    };
  }, [map]);

  return null;
};

export default DisplayLocation;
