import Link from 'next/link';

import { type NextPage } from 'next';
import TopBar from '../TopBar';
import SideBar from '../SideBar';
import Fact from '../Fact';
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

  //define random fact just to test the component
  const fact1 = {
    id: "1",
    createdAt: "2021-05-01T00:00:00.000Z",
    updatedAt: "2021-05-01T00:00:00.000Z",
    title: "Fact 1",
    shortDesc: "Short description of fact 1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    from: "2021-05-01T00:00:00.000Z",
    until: "2021-05-01T00:00:00.000Z",
    bannerImg: "https://picsum.photos/200/300",
    verified: true,
    video: ["https://www.youtube.com/watch?v=1ygdAiDxKfI"],
    audio: ["https://www.youtube.com/watch?v=1ygdAiDxKfI"],
    author: {
      id: "1",
      name: "Author 1",
    },
    tags: [
      {
        id: "1",
        name: "Tag 1",
      },
    ],
    locations: [
      {
        id: "1",
        name: "Location 1",
      },
    ],
    personsInvolved: [
      {
        id: "1",
        name: "Famous person 1",
      },
      {
        id: "2",
        name: "Famous person 2",
      }
    ],
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
      <div className="BAFTtest">
        <Fact fact={fact1} />
      </div>
    </header>
  );
}

export default MainNavigation;
