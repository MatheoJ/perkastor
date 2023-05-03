import { useState, useRef, FormEventHandler } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from './auth-form.module.css';
import { type NextPage } from "next";

async function createUser(email: string, username: string, password: string) {
  console.log("createUser");
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

const AuthForm: NextPage = () => {
  const [formSuccess, setFormSuccess] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const emailOrPseudoInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
    if (formError !== '') {
      setFormError('');
      setFormSuccess('');
    }
  }

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const enteredEmailOrPseudo = emailOrPseudoInputRef.current?.value;
    const enteredEmail = emailInputRef.current?.value;
    const enteredUsername = usernameInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    // optional: Add validation
    let credentials: { redirect: boolean; email?: string; password: string; username?: string; };
    if (enteredEmailOrPseudo) {
      if (enteredEmailOrPseudo.includes('@')) {
        credentials = {
          redirect: false,
          email: enteredEmailOrPseudo,
          password: enteredPassword,
        }
      } else {
        credentials = {
          redirect: false,
          username: enteredEmailOrPseudo,
          password: enteredPassword,
        }
      }
    } else {
      credentials = {
        redirect: false,
        email: enteredEmail,
        username: enteredUsername,
        password: enteredPassword,
      }
    }

    if (isLogin) {
      console.log("signIn")
      const result = await signIn('credentials', credentials);

      if (!result?.error) {
        // set some auth state
        router.replace('/profile');
        setFormError('');
        setFormSuccess('Connexion réussie');
      } else {
        setFormError(result.error);
        setFormSuccess('');
      }
    } else {
      try {
        const result = await createUser(enteredEmail, enteredUsername, enteredPassword);
        setIsLogin(true);
        setFormSuccess('Compte créé avec succès, veuillez vous connecter');
        setFormError('');
      } catch (error) {
        setFormError(error.message || 'Connexion échouée, veuillez réessayer plus tard');
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>
      <form onSubmit={submitHandler}>
        {isLogin ?
          <div className={classes.control}>
            <label htmlFor='email'> Email / Pseudonyme </label>
            < input type='text' id='emailOrUsername' required ref={emailOrPseudoInputRef} />
          </div>
          : <>
            <div className={classes.control}>
              <label htmlFor='email'> Email </label>
              < input type='email' id='email' required ref={emailInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='username'> Pseudonyme (visible publiquement) </label>
              < input type='username' id='username' required ref={usernameInputRef} />
            </div>
          </>}

        <div className={classes.control}>
          <label htmlFor='password'>Mot de passe</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <span id="error" className="px-4 py-3" style={{ color: "#f56565" }}>{formError}</span>
        <span id="success" className="px-4 py-3" style={{ color: "#90EE90" }}>{formSuccess}</span>
        <div className={classes.actions}>
          <button>{isLogin ? 'Connexion' : 'Créer un compte'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Créer un nouveau compte' : 'Se connecter avec un compte existant'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
