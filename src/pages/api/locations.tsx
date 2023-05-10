// pages/api/locations.js
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { ExtendedSession } from 'types/types';
import { prisma } from '../../lib/db'

async function convertToGeoJSON(location, geoJSON) {
  const { id, geometry, latitude, longitude, area, type, name } = location;
  const coordinates = [longitude, latitude];



  geoJSON.features.push({
    type: "Feature",
    geometry: {
      type: geometry,
      coordinates: coordinates
    },
    properties: {
      id: id,
      area: area,
      type: type,
      name: name
      // include any additional properties here
    }
  });

}

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session: ExtendedSession = await getServerSession(req, res, authOptions);

  console.log("laa2 : ");
  console.log(req.query.type);
  console.log(req.query.maxLongitude)
  console.log(req.query.minLongitude)
  console.log(req.query.maxLatitude)
  console.log(req.query.minLatitude)

  if (req.method !== 'GET') {
    res.status(500).json({ message: 'Requettes Get autorisées uniquement' });
    return;
  }

  var typeOfLocation;

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

  const minLatitude = req.query.minLatitude;
  const maxLatitude = req.query.maxLatitude;
  const minLongitude = req.query.minLongitude;
  const maxLongitude = req.query.maxLongitude;



  try {
    let prismaResult;
    prismaResult = await prisma.location.findMany({
      where: {
        AND: [
          {
            latitude: {
              lte: parseFloat(Array.isArray(maxLatitude) ? maxLatitude[0] : maxLatitude),
              gte: parseFloat(Array.isArray(minLatitude) ? minLatitude[0] : minLatitude),
            },
          },
          {
            longitude: {
              gte: parseFloat(Array.isArray(minLongitude) ? minLongitude[0] : minLongitude),
              lte: parseFloat(Array.isArray(maxLongitude) ? maxLongitude[0] : maxLongitude),
            },
          },
          {
            type: typeOfLocation,
          },
        ],
      },
    });




    var geojson = {
      type: "FeatureCollection",
      features: [],
    };

    await prismaResult.forEach(async (location) => {
      const feature = await convertToGeoJSON(location, geojson);
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