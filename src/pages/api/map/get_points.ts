// pages/api/locations.js

import type { NextApiRequest, NextApiResponse } from 'next'
import { convertToGeoJSON } from '~/lib/map-utils';
import { connectToDatabase } from "~/lib/mongodb";

async function handler(req : NextApiRequest, res : NextApiResponse) {
  
    if (req.method !== 'GET') {
        return;
    }

    let typeOfLocation ;

    if (Number(Array.isArray(req.query.type) ? req.query.type[0] : req.query.type) < 10){
        typeOfLocation = "ville";
    }

    const minLatitude = req.query.minLatitude;
    const maxLatitude = req.query.maxLatitude;
    const minLongitude = req.query.minLongitude;
    const maxLongitude = req.query.maxLongitude;

    const query = {
      $and: [
        { "longitude": { $gte: minLongitude, $lte: maxLongitude } },
        { "latitude": { $gte: minLatitude, $lte: maxLatitude } },
        { "type": "region" }
      ],
    };
     
  try {    
    // Use MongoClient to connect to the Database instead of prisma to use geo queries
    const client = await connectToDatabase();
    const collection = client.db().collection("locations");
    const cursor = collection.find(query);

    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    cursor.map((location) => {
      convertToGeoJSON(location, geojson);
    });


    res.status(200).json(geojson);
    await client.close();
    return;
  } catch(error) {
    res.status(500).json({ message: 'Impossible de se connecter à la base de données !' });
    return;    
  }
}

export default handler;