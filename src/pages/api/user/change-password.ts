import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ExtendedSession } from 'types/types';
import { prisma } from '../../../lib/db'

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

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;


  // get the user from its email
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });

  const passwordsAreEqual = await verifyPassword(oldPassword, user.password);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Votre ancien mot de passe est invalide.' });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  // update the user's password
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });
  if (updatedUser) {
    res.status(200).json({ message: 'Mot de passe mis à jour !' });
  } else {
    res.status(500).json({ message: 'Erreur serveur.' });
  }

}

export default handler;
