import { Fragment } from 'react';

import MainNavigation from './main-navigation';

import { ReactNode } from "react";
// ...
interface Props {
    children: ReactNode;
}


const Layout = ({children}: Props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}

export default Layout;
