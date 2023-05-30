import { type NextPage } from "next";
import { useState } from 'react';
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import Batf from "../components/batf/Batf";
import SearchBar from "../components/searchbar/SearchBar";

import { api } from "~/utils/api";
import { Search } from "@mui/icons-material";

const mapWrapperPage: NextPage = () => {

  return (
    <div className="mapWrapper">
      <SideBar
        isOpen={true}
      />
      <Map locationSelected={undefined}
        onLocationSelect={function (): void {
          throw new Error("Function not implemented");
        }} />
      <SearchBar showChecklist={true} usedInForm={false} />
      <Batf />
    </div >
  )
}

export default mapWrapperPage;