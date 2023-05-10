import { type NextPage } from "next";
import { useState } from 'react';
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import Batf from "../components/batf/Batf";
import SearchBar from "../components/searchbar/SearchBar";

import { api } from "~/utils/api";
import { Search } from "@mui/icons-material";

export default function mapWrapperPage() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [selectedItem, setSelectedItem] = useState<string>(""); // Keep track of the selected item in the sidebar
  const [insertMode, setInsertMode] = useState<boolean>(false); // Keep track of the insert mode / view mode
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(false);
  const toggleSidebar = () => { // hide / show sidebar
    setSidebarIsOpen(!sidebarIsOpen);
  };

  const handleSidebarItemClick = ({ item }: { item: string }) => { // Change the selected item in the sidebar
    setSelectedItem(item);
  }

  const setInsertModeHandler = ({ insertMode }: { insertMode: boolean }) => {
    setInsertMode(() => insertMode);
  };


  return (
    <> {/* TODO: Insert a flex parent component that divides the width in half */}
      <div className="mapWrapper">
        <SideBar
          isOpen={true}
          toggleSidebar={null}
          onSidebarItemClick={handleSidebarItemClick}
          insertMode={insertMode}
          setInsertMode={setInsertModeHandler}
        />
        <Map locationSelected={undefined} onLocationSelect={function (locSelected: any): void {
          throw new Error("Function not implemented.");
        } } />
        <SearchBar showChecklist={true} />
        {<Batf>
        </Batf>}
      </div >
    </>
  )
}


