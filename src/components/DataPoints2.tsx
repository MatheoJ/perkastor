import React, { useEffect } from "react";
import type maplibregl from "maplibre-gl";
import { MongoClient } from "mongodb";
import "maplibre-gl/dist/maplibre-gl.css";
import { type NextPage } from "next";

interface DataPointsProps {
  map: maplibregl.Map;
}

const DataPoints: NextPage<DataPointsProps> = ({ map }) => {
  useEffect(() => {
    map.on("zoomend", async function () {
      console.log("A zoomend event occurred.");
      console.log(map.getBounds());

      const queryParams = new URLSearchParams({
        type: map.getZoom().toString(),
        maxLongitude: map.getBounds()._ne.lng.toString(),
        maxLatitude: map.getBounds()._ne.lat.toString(),
        minLongitude: map.getBounds()._sw.lng.toString(),
        minLatitude: map.getBounds()._sw.lat.toString(),
      });

      const response = await fetch(`/api/map/get_points?${queryParams}`, {
        method: "GET",
      });

      if (response.status === 200) { // Check if the response status is 200
        const responseData = await response.json();
        console.log(responseData);
    
        if (!map.getSource("dataLoc")) {
          map.addSource("dataLoc", {
            type: "geojson",
            data: responseData,
            cluster: false,
          });
        } else {
          // @ts-ignore
          map.getSource("dataLoc").setData(responseData); // DO NOT MODIFY THIS LINE
        }
        if (!map.getLayer("unclustered-point_loc")) {
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
      }

    });

    // Cleanup event listener when component is unmounted
    return () => {};
  }, [map]);

  return null;
};

export default DataPoints;
