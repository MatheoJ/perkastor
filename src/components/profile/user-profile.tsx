import { useState } from 'react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

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
    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Votre Profil</h1>
      <ProfileForm onChangePassword={changePasswordHandler} formError={formError} formSuccess={formSuccess}/>
    </section>
  );
}

export default UserProfile;
