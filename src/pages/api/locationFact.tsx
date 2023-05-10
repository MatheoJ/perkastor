// pages/api/locations.js

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase}from '../../lib/mongodb';

import { ExtendedSession } from 'types/types';


async function convertToGeoJSON(location, geoJSON) {
  const { _id, geometry, latitude, longitude, area, type, name } = location;
  const coordinates = [longitude, latitude];

  console.log(location);

  geoJSON.features.push({
    type:"Feature",
    geometry:{
      type: geometry,
      coordinates: coordinates
    },
    properties :{
      id: _id,
      area: area,
      type: type,
      name: name
      // include any additional properties here
   }});

}

async function handler(req : NextApiRequest, res : NextApiResponse) {
  
    const session: ExtendedSession = await getServerSession(req, res, authOptions);

  console.log("laa3 : ");
  console.log(req.query.type);
  console.log(req.query.maxLongitude)
  console.log(req.query.minLongitude)
  console.log(req.query.maxLatitude)
  console.log(req.query.minLatitude)

    if (req.method !== 'GET') {
        res.status(500).json({ message: 'Requettes Get autorisées uniquement' });
        return; 
    }

    var typeOfLocation ;

    if (Number(req.query.type) > 13) {
      typeOfLocation = "rue";
    }
    else if (Number(req.query.type) > 8) {
      typeOfLocation = "ville";
    }
    else if (Number(req.query.type) > 6) {
      typeOfLocation = "departement";
    }
    else {
      typeOfLocation = "region";
    }

    const minLatitude = Array.isArray(req.query.minLatitude) ? req.query.minLatitude[0] : req.query.minLatitude;
    const maxLatitude = Array.isArray(req.query.maxLatitude) ? req.query.maxLatitude[0] : req.query.maxLatitude;
    const minLongitude = Array.isArray(req.query.minLongitude) ? req.query.minLongitude[0] : req.query.minLongitude;
    const maxLongitude = Array.isArray(req.query.maxLongitude) ? req.query.maxLongitude[0] : req.query.maxLongitude;


    var query = {
      $and: [
        { "longitude": { $gte: parseFloat(minLongitude), $lte: parseFloat(maxLongitude) } },
        { "latitude": { $gte: parseFloat(minLatitude), $lte: parseFloat(maxLatitude) } },
        { "type": typeOfLocation },
      ],
    };


  
  console.log(query);

     
  try {    
   /*  const collection = (await clientPromise).db().collection("locations");
    const cursor = collection.find(query); */

   

    const client = await connectToDatabase();
    const collection = client.db().collection("locations");
    const cursor = collection.find(query);

    var geojson = {
      type: "FeatureCollection",
      features: [],
    };

    console.log(cursor);

    await cursor.forEach(async (location) => {
      const feature = await convertToGeoJSON(location, geojson);
    });

    res.status(200).json(geojson);
    return;

  } catch(error) {
    console.log(error);
    res.status(500).json({ message: 'Impossible de se connecter à la base de données !' });
    return;    
  }
}

export default handler;