import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import CropperView from '../cropper/CropperView';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { IconButton } from '@material-ui/core';
import { Share } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';


function UserProfile() {
  const [formSuccess, setFormSuccess] = useState<string>();
  const [formError, setFormError] = useState<string>();

  const { data: session, status, update } = useSession({
    required: false
  })
  console.log(session)

  function copyUrl() {
    const { asPath } = useRouter();
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const URL = `${origin}${asPath}`;
    navigator.clipboard.writeText(`${URL}/profile/${session.user.id}`)
  }

  async function changePasswordHandler(passwordData: Object) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      setFormError(data.message || 'Erreur lors de la mise à jour du mot de passe. Veuillez réessayer plus tard.');
      setFormSuccess('');
    } else if (formError !== '') {
      setFormError('');
      setFormSuccess('Votre mot de passe a été mis à jour avec succès !')
    }
  }

  return (
    <section className={classes.profile}>
      <CropperView toUpdate='user' toUpdateId={session.user.id} uploadOnSubmit={true} image={session.user.image} alt='Picture profile' />
      {/* Share profile url icon button */}
      <IconButton  size='small' color='primary' aria-label='share profile' component='button'
        onClick={() => {() => copyUrl()}}
      >
        <Share />
      </IconButton>
      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
      <ul>
        <li>Prénom: {session.user.firstName}</li>
        <li>Nom de famille: {session.user.lastName ?? "N/A"}</li>
        <li>Email vérifié: {session.user.emailVerified ? "Oui" : "Non"}</li>
      </ul>
      <ProfileForm onChangePassword={changePasswordHandler} formError={formError} formSuccess={formSuccess} />
      <Button variant="outlined" color="primary" onClick={() => update()}>
        Mettre à jour la session
      </Button>
    </section>
  );
}

export default UserProfile;