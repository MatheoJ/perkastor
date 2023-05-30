import { type NextPage } from 'next';
import TopBar from '../TopBar';
import SideBar from '../SideBar';
import { useState } from 'react';

const MainNavigation: NextPage = () => {
  return (
    <header>
      <TopBar />
      <SideBar
        isOpen={false}
      />
      
    </header>
  );
}

export default MainNavigation;
