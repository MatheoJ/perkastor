import { type NextPage } from "next";
import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";

import { api } from "~/utils/api";

const mapWrapper: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<String>(""); //Savoir quel item est sélectionné dans la sidebar

  const toggleSidebar = () => { //Fonction qui permet de faire apparaître ou disparaître la sidebar
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const handleSidebarItemClick = ({item} : {item : String}) => { //Fonction qui permet de changer l'item sélectionné dans la sidebar
    setSelectedItem(item);
    console.log("selectedItem : " + selectedItem);
  }

  return (
    <>
      <Map />
      <TopBar toggleSidebar={toggleSidebar} />
      <SideBar isOpen={sidebarIsOpen} toggleSidebar={toggleSidebar} onSidebarItemClick={handleSidebarItemClick}/>
    </>
  );
};

export default mapWrapper;


