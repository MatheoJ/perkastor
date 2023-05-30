import { type NextPage } from "next";
import { useState } from 'react';
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import Batf from "../components/batf/Batf";
import SearchBar from "../components/searchbar/SearchBar";

import { api } from "~/utils/api";
import { Search } from "@mui/icons-material";

const mapWrapperPage: NextPage = () => {

  const [selectedItem, setSelectedItem] = useState<string>(""); // Keep track of the selected item in the sidebar
  const handleSidebarItemClick = ({ item }: { item: string }) => { // Change the selected item in the sidebar
    setSelectedItem(item);
  }

  return (
    <div className="mapWrapper">
      <SideBar
        isOpen={true}
      />
      <SearchBar showChecklist={true} usedInForm={false} />
      <Batf />
    </div >
  )
}

export default mapWrapperPage;