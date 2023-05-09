import { useState, useRef, FormEventHandler } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Google,
  Facebook,
  GitHub,
  Twitter,
} from "@mui/icons-material";

import classes from './auth-form.module.css';
import { type NextPage } from "next";
import { Button } from '@mui/material';

async function createUser(email: string, name: string, password: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
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
  const CALLBACK_URL = `${window.location.origin}/profile`
  const [formSuccess, setFormSuccess] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const emailOrPseudoInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
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
    const enteredName = nameInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    // optional: Add validation
    let credentials: any;
    if (enteredEmailOrPseudo) {
      if (enteredEmailOrPseudo.includes('@')) {
        credentials = {
          callbackUrl: CALLBACK_URL,
          redirect: false,
          email: enteredEmailOrPseudo,
          password: enteredPassword,

        }
      } else {
        credentials = {
          callbackUrl: CALLBACK_URL,
          redirect: false,
          name: enteredEmailOrPseudo,
          password: enteredPassword,
        }
      }
    } else {
      credentials = {
        callbackUrl: CALLBACK_URL,
        redirect: false,
        email: enteredEmail,
        name: enteredName,
        password: enteredPassword,
      }
    }

    if (isLogin) {
      const result = await signIn('credentials', credentials);

      if (result.status === 200) {
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
        const result = await createUser(enteredEmail, enteredName, enteredPassword);
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
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      <form onSubmit={submitHandler}>
        {isLogin ?
          <>
            <div className={classes.control}>
              <label htmlFor='email'> Email / Pseudonyme </label>
              < input type='text' id='emailOrName' required ref={emailOrPseudoInputRef} />
            </div>

            <div className={classes.control}>
              <label htmlFor='password'>Mot de passe</label>
              <input
                type='password'
                id='password'
                required
                ref={passwordInputRef}
              />
            </div>

            {/* Add */}
            <div className={classes.providers}>
              <Button variant={"outlined"} color={"primary"} startIcon={<GitHub />}
                onClick={() => signIn('github', { callbackUrl: CALLBACK_URL })}>Github</Button>
              <Button variant={"outlined"} color={"primary"} startIcon={<Google />}
                onClick={() => signIn('google', { callbackUrl: CALLBACK_URL })}>Google</Button>
              <Button variant={"outlined"} color={"primary"} startIcon={<Facebook />}
                onClick={() => signIn('facebook', { callbackUrl: CALLBACK_URL })}>Facebook</Button>
              <Button variant={"outlined"} color={"primary"} startIcon={<img src="resources/discord.png" height='18px' width='18px' />}
                onClick={() => signIn('discord', { callbackUrl: CALLBACK_URL })}>Discord</Button>
              <Button variant={"outlined"} color={"primary"} startIcon={<Twitter />}
                onClick={() => signIn('twitter', { callbackUrl: CALLBACK_URL })}>Twitter</Button>
            </div>
          </>
          : <>
            <div className={classes.control}>
              <label htmlFor='email'> Email </label>
              < input type='email' id='email' required ref={emailInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='name'> Pseudonyme (visible publiquement) </label>
              < input type='name' id='name' required ref={nameInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='password'>Mot de passe</label>
              <input
                type='password'
                id='password'
                required
                ref={passwordInputRef}
              />
            </div>
          </>}

        <span id="error" className="px-4 py-3" style={{ display: 'block', color: "#f56565" }}>{formError}</span>
        <span id="success" className="px-4 py-3" style={{ display: 'block', color: "#90EE90" }}>{formSuccess}</span>
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
