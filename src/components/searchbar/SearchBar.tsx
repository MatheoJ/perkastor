import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";



function SearchBar() {
  const router = useRouter();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const search = (e) => {
    e.preventDefault();
  };

  return (
    <div className={`searchbar ${showSearchBar ? "active" : ""}`}>
      <IconButton onClick={toggleSearchBar}>
        <SearchIcon />
      </IconButton>
      <form className="searchBar__form" onSubmit={search}>
        <input
          type="text"
          className="searchBar__input"
          placeholder="Chercher un évènement, un lieu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;
