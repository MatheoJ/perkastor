import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import CropperView from '../cropper/CropperView';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { IconButton } from '@material-ui/core';
import { Share } from '@mui/icons-material';
import { useRouter } from 'next/router';


function UserProfile() {
  const [formSuccess, setFormSuccess] = useState<string>();
  const [formError, setFormError] = useState<string>();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  const { data: session, status, update } = useSession({
    required: false
  })

  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [update])

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === "visible" && update()
    window.addEventListener("visibilitychange", visibilityHandler, false)
    return () => window.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [update])

  function copyUrl() {
    const { asPath } = useRouter();
    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const URL = `${origin}${asPath}`;
    navigator.clipboard.writeText(`${URL}/profile/${session.user.id}`)
  }

  async function changePasswordHandler(passwordData: string) {
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

  
  console.log(session)
  return (
    <section className={classes.profile}>
      <CropperView toUpdate='user' uploadOnSubmit={true} image={session.user.image}/>
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
    </section>
  );
}

export default UserProfile;