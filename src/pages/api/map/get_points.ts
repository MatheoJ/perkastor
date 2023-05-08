// pages/api/locations.js

import geojson from "geojson";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/db';
import { type } from "os";



async function convertToGeoJSON(location, geoJSON) {
  const { id, geometry, latitude, longitude, area, type, name } = location;
  const coordinates = [longitude, latitude];

  console.log("location : ");
  

  geoJSON.features.push({
    type:"Feature",
    geometry:{
      type: geometry,
      coordinates: coordinates
    },
    properties :{
      id: id,
      area: area,
      type: type,
      name: name
      // include any additional properties here
   }});

}

async function handler(req : NextApiRequest, res : NextApiResponse) {
  
  console.log("laa : ");
  console.log(req.query.type);
  console.log(req.query.maxLongitude)
  console.log(req.query.minLongitude)
  console.log(req.query.maxLatitude)
  console.log(req.query.minLatitude)

    if (req.method !== 'GET') {
        return;
    }

    var typeOfLocation ;

    if(req.query.type < 10){
        typeOfLocation = "ville";
    }

    const minLatitude = req.query.minLatitude;
    const maxLatitude = req.query.maxLatitude;
    const minLongitude = req.query.minLongitude;
    const maxLongitude = req.query.maxLongitude;




    var query = {
      $and: [
        { "longitude": { $gte: minLongitude, $lte: maxLongitude } },
        { "latitude": { $gte: minLatitude, $lte: maxLatitude } },
        { "type": "region" }
      ],
    };
     
  try {    

    const client = await connectToDatabase();
    const collection = client.db().collection("locations");
    const cursor = collection.find(query);

    var geojson = {
      type: "FeatureCollection",
      features: [],
    };

    await cursor.forEach(async (location) => {
      const feature = await convertToGeoJSON(location, geojson);
    });


    res.status(200).json(geojson);
    await client.close();
    return;
  } catch(error) {
    res.status(500).json({ message: 'Impossible de se connecter à la base de données !' });
    return;    
  }

  res.status(200);

  res.json({
    key: "value",
    anotherKey: "anotherValue",
  });

  return;
}

export default handler;