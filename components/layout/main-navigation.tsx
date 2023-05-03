import Link from 'next/link';

import classes from './main-navigation.module.css';
import { type NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';

const MainNavigation: NextPage = () => {
  const { data: session } = useSession()

  function logoutHandler() {
    signOut();
  }

  return (
    <header className={classes.header}>
      <Link href='/'>
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {session ? (
            <>
              <li>
                <Link href='/profile'>Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
