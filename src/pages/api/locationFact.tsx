// pages/api/locations.js

import type { NextApiRequest, NextApiResponse } from 'next'
import { convertToGeoJSON } from '~/lib/map-utils';
import { connectToDatabase}from '../../lib/mongodb';

async function handler(req : NextApiRequest, res : NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(500).json({ message: 'Requettes Get autorisées uniquement' });
        return; 
    }

    let typeOfLocation: string;

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


    const query = {
      $and: [
        { "longitude": { $gte: parseFloat(minLongitude), $lte: parseFloat(maxLongitude) } },
        { "latitude": { $gte: parseFloat(minLatitude), $lte: parseFloat(maxLatitude) } },
        { "type": typeOfLocation },
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

    cursor.map(async (location) => {
      convertToGeoJSON(location, geojson);
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