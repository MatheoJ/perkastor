import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { ExtendedSession } from 'types/types';
import * as AWS from 'aws-sdk';

// credit: https://www.adamrichardson.dev/blog/next-js-image-upload-s3
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return;
  }

  console.log("image")

  // check if the user is logged in

  // use getServerSession instead of getSession to avoid an extra fetch to an API route
  // if we didn't need the user info (here its email), we could just use getToken
  const session: ExtendedSession = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'Non authentifié !' });
    return;
  }

  // get the image extension
  const fileNameForm = req.body.fileName.replace('-', '');
  const fileType = req.body.fileType;

  // create a new image name
  const fileName = `user-${session.user.id}-${fileNameForm}`;

  // upload the image to the cloud storage (AWS)

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "eu-west-3"
  });
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: `image/${fileType}`,
    ACL: 'public-read'
  };

  try {
    // Get a signed URL from S3 for uploading an object
    s3.getSignedUrl("putObject", s3Params, async (err, data) => {
      if (err) {
        return res.json({ success: false, error: err });
      }
      const returnData = {
        signedRequest: data,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      };
      const client = new PrismaClient();
      const imageUrl = await client.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: returnData.url,
        },
      });

      return res.status(200).json(returnData);
    });
  } catch (err) {
    return res.status(500).json(err);
  }
}

export default handler;
