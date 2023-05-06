import Link from 'next/link';

import { type NextPage } from 'next';
import TopBar from '../TopBar';
import SideBar from '../SideBar';
import Batf from '../batf/Batf';
import { useState } from 'react';

const MainNavigation: NextPage = () => {
  const [selectedItem, setSelectedItem] = useState<String>(""); // Keep track of the selected item in the sidebar
  const [insertMode, setInsertMode] = useState<boolean>(false); // Keep track of the insert mode / view mode
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const toggleSidebar = () => { // hide / show sidebar
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const handleSidebarItemClick = ({ item }: { item: String }) => { // Change the selected item in the sidebar
    console.log("selectedItem : " + item);
    setSelectedItem(item);
  }

  const setInsertModeHandler = ({ insertMode }: { insertMode: boolean }) => {
    setInsertMode(() => insertMode);
  };

  return (
    <header>
      <TopBar toggleSidebar={toggleSidebar} />
      <SideBar
        isOpen={sidebarIsOpen}
        toggleSidebar={toggleSidebar}
        onSidebarItemClick={handleSidebarItemClick}
        insertMode={insertMode}
        setInsertMode={setInsertModeHandler}
      />
    </header>
  );
}

export default MainNavigation;
