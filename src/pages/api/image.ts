import AWS from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "types/types";
import { authOptions } from "~/server/auth";
import { prisma } from '../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return;
    }

    // check if the user is logged in

    // use getServerSession instead of getSession to avoid an extra fetch to an API route
    // if we didn't need the user info (here its email), we could just use getToken
    const session: ExtendedSession = await getServerSession(req, res, authOptions)

    if (!session) {
        res.status(401).json({ message: 'Non authentifié !' });
        return;
    }

    const { toUpdate, toUpdateId, fileName, fileType} = req.body;
    if (!fileName) {
        res.status(401).json({ message: 'Nom de fichier manquant' });
        return;
    }

    if (!fileType) {
        res.status(401).json({ message: 'Type de fichier manquant' });
        return;
    }

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
        res.status(401).json({ message: 'Type de fichier non supporté' });
        return;
    }

    if (toUpdate !== "user" && toUpdate !== "fact" && toUpdate !== "chain" && toUpdate !== "historicalPerson") {
        res.status(401).json({ message: 'Mauvais type de donnée à mettre à jour !' });
        return;
    }
    if (!toUpdateId) {
        res.status(401).json({ message: 'Pas d\'id à mettre à jour !' });
        return;
    }

    // remove extension from fileName
    const fileNameWithoutExtension = fileName.split('.')[0];

    // create a new image name
    const fileNameDB = `${toUpdate}-${toUpdateId}-${fileNameWithoutExtension.replace('-', '_').replace(' ', '_')}`;

    // upload the image to the cloud storage (AWS)

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileNameDB,
        ContentType: fileType,
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
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileNameDB}`,
            };
            switch (toUpdate) {
                case "user":
                    await prisma.user.update({
                        where: {
                            id: toUpdateId,
                        },
                        data: {
                            image: returnData.url,
                        },
                    });
                    break;
                case "fact":
                    await prisma.fact.update({
                        where: {
                            id: toUpdateId,
                        },
                        data: {
                            bannerImg: returnData.url,
                        },
                    });
                    break;
                case "chain":
                    await prisma.factChain.update({
                        where: {
                            id: toUpdateId,
                        },
                        data: {
                            image: returnData.url,
                        },
                    });
                    break;
                case "historicalPerson":
                    await prisma.historicalPerson.update({
                        where: {
                            id: toUpdateId,
                        },
                        data: {
                            image: returnData.url,
                        },
                    });
                    break;
                default:
                    break;
            }
            return res.status(200).json(returnData);
        });
    } catch (err) {
        return res.status(500).json(err);
    }
}

export default handler;