import { Fragment } from 'react';

import MainNavigation from './main-navigation';

import { ReactNode } from "react";
import { NextPage } from 'next';
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
