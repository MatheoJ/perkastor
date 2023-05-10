import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from "@mui/material";
import { SearchFilters, SearchResult } from 'types/types';
import FiltersChecklist from "./FiltersChecklist";


function SearchBar({ showChecklist }: { showChecklist: boolean }) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({
    event: true,
    anecdote: false,
    historicalFigure: true,
    location: true,
    chain: true,
    user: true,
  });

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sending request");
    setIsLoading(true);
    // passer les parametres sélectionnés comme filtre puis ajouter &filtersParam=${JSON.stringify({})} a la fin de l'url
    const results = await fetch(`/api/search?query=${searchTerm}&filtersParam=${JSON.stringify(filters)}`);
    const resultat = await results.json();
    setSearchResults(resultat.data);
    setIsLoading(false);
    console.log('response arrived');
    console.log(resultat);
  };


  return (
    <div className={`searchbar ${showSearchBar ? "active" : ""}`}>
      <div className="searching-area">
        <IconButton onClick={toggleSearchBar}>
          <SearchIcon />
        </IconButton>
        <form className="searchBar__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="searchBar__input"
            placeholder="Chercher un évènement, un lieu..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchResults([]);
            }}
          />

        </form>
        {isLoading && <div className="loading" ><CircularProgress size={24} color="inherit" /></div>}
      </div>
      {searchResults && Object.values(searchResults).some(cat => cat.length > 0) && (
        <div className="searchResults">
          <div className="searchResults-content">
            {Object.entries(searchResults).map(([category, results]) => (
              <React.Fragment key={category}>
                {results.length > 0 && (
                  <React.Fragment>
                    <span className="category" ><strong>{category}</strong></span>
                    {results.slice(0, 10).map(result => {
                      if (result.title == '') {
                        return (
                          <div key={result.id} className="dataItem">
                            <span className="dataItem__name">{'(' + result.keyDates[0].slice(0, 4) + ') ' + result.content}</span>
                          </div>
                        )
                      } else {
                        return (
                          <div key={result.id} className="dataItem">
                            <span className="dataItem__name">{result.title}</span>
                          </div>
                        )
                      }
                    })}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {showChecklist &&
        <div className="checklist-area">
          <FiltersChecklist filters={{
            event: true,
            anecdote: false,
            chain: true,
            historicalFigure: true,
            location: true,
            user: true
          }} setFilters={setFilters} />
        </div>
      }
    </div >
  );
}

export default SearchBar;
