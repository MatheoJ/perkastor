import { useState, useRef, FormEventHandler } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import classes from './auth-form.module.css';
import { type NextPage } from "next";

async function createUser(email: string, password: string) {
  console.log("createUser");
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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
  const [formError, setFormError] = useState<string>();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
    if (formError !== '') {
      setFormError('');
    }
  }

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    // optional: Add validation

    if (enteredPassword && enteredEmail) {
      if (isLogin) {
        console.log("signIn")
        const result = await signIn('credentials', {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        });

        if (!result?.error) {
          // set some auth state
          router.replace('/profile');
          setFormError("");
        } else {
          setFormError(result.error);
        }
      } else {
        try {
          const result = await createUser(enteredEmail, enteredPassword);
          setFormError("");
        } catch (error) {
          setFormError(error.message || 'Connexion échouée, veuillez réessayer plus tard');
        }
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      < form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'> Your Email </label>
          < input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <span id="error" className="px-4 py-3" style={{color: "#f56565"}}>{formError}</span>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
