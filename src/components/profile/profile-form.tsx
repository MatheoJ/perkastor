import { useRef, useState } from 'react';

import classes from './profile-form.module.css';
import { type NextPage } from 'next';

interface Props {
  onChangePassword: (data: { oldPassword: string; newPassword: string }) => void;
  formError: string;
  formSuccess: string;
}

const ProfileForm: NextPage<Props> = ({onChangePassword, formError, formSuccess}) => {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const enteredOldPassword = oldPasswordRef.current?.value;
    const enteredNewPassword = newPasswordRef.current?.value;

    // optional: Add validation

    onChangePassword({
      oldPassword: enteredOldPassword,
      newPassword: enteredNewPassword
    });
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='old-password'>Ancien mot de passe</label>
        <input type='password' id='old-password' ref={oldPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor='new-password'>Nouveau mot de passe</label>
        <input type='password' id='new-password' ref={newPasswordRef} />
      </div>
      {formError && <span className="px-4 py-3" style={{color: "#f56565"}}>{formError}</span>}
      {formSuccess && <span className="px-4 py-3" style={{color: "#90EE90"}}>{formSuccess}</span>}
      <div className={classes.action}>
        <button>Modifier le mot de passe</button>
      </div>
    </form>
  );
}

export default ProfileForm;
