import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { MongoClient } from "mongodb";
import "maplibre-gl/dist/maplibre-gl.css";

interface DataPointsProps {
  map: maplibregl.Map;
}

const DataPoints: React.FC<DataPointsProps> = ({ map }) => {
  useEffect(() => {
    map.on("zoomend", async function () {
      console.log("A zoomend event occurred.");
      console.log(map.getBounds());

      const queryParams = new URLSearchParams({
        type: map.getZoom(),
        maxLongitude: map.getBounds()._ne.lng,
        maxLatitude: map.getBounds()._ne.lat,
        minLongitude: map.getBounds()._sw.lng,
        minLatitude: map.getBounds()._sw.lat,
      });

      const response = await fetch(`/api/map/get_points?${queryParams}`, {
        method: "GET",
      });

      if (response.status === 200) { // Check if the response status is 200
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

    });

    // Cleanup event listener when component is unmounted
    return () => {};
  }, [map]);

  return null;
};

export default DataPoints;
