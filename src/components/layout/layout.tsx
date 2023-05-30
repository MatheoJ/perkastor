import { Fragment } from 'react';

import MainNavigation from './main-navigation';

import { type ReactNode } from "react";
import { type NextPage } from 'next';
// ...
interface Props {
    children: ReactNode;
}

const Layout: NextPage<Props> = ({children}) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
