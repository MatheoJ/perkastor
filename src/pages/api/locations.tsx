// pages/api/locations.js
import type { NextApiRequest, NextApiResponse } from 'next'
import { convertToGeoJSON } from '~/lib/map-utils';
import { prisma } from '../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'GET') {
    res.status(500).json({ message: 'Seules les requêtes GET sont autorisées' });
    return;
  }

  let typeOfLocation;

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

  // search for locations in database a little more than the current view
  // to avoid having to reload the map when the user moves too often
  const scale = 1.1;

  const minLatitude = parseFloat(Array.isArray(req.query.minLatitude) ? req.query.minLatitude[0] : req.query.minLatitude) / scale;
  const maxLatitude = parseFloat(Array.isArray(req.query.maxLatitude) ? req.query.maxLatitude[0] : req.query.maxLatitude) * scale;
  const minLongitude = parseFloat(Array.isArray(req.query.minLongitude) ? req.query.minLongitude[0] : req.query.minLongitude) / scale;
  const maxLongitude = parseFloat(Array.isArray(req.query.maxLongitude) ? req.query.maxLongitude[0] : req.query.maxLongitude) * scale;


  try {
    let prismaResult;
    prismaResult = await prisma.location.findMany({
      where: {
        AND: [
          {
            latitude: {
              lte: maxLatitude,
              gte: minLatitude,
            },
          },
          {
            longitude: {
              gte: minLongitude,
              lte: maxLongitude,
            },
          },
          {
            type: typeOfLocation,
          },
          {
            hasFact : req.query.filter ? req.query.filter === "hasFact" ? true : req.query.filter === "noFact" ? false : undefined : undefined
          }
        ],
      },
    });
    
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    prismaResult.map((location) => {
      convertToGeoJSON(location, geojson);
    });


    res.status(200).json(geojson);
    return;
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Impossible de se connecter à la base de données !' });
    return;
  }
}

export default handler;