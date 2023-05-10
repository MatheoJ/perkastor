import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from "@mui/material";
import { SearchFilters, SearchResult } from 'types/types';
import { bus } from "~/utils/bus";
import {selectEventFromSearchBar, selectHistoricalFigureFromSearchBar, selectLocationFromSearchBar, selectSearchBarResultEvent} from '../../events/SelectSearchBarResultEvent';
import { Fact, HistoricalPerson } from "@prisma/client";
import {Geometry} from "geojson";
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
    setIsLoading(true);

    // passer les parametres sélectionnés comme filtre puis ajouter &filtersParam=${JSON.stringify({})} a la fin de l'url
    const results = await fetch(`/api/search?query=${searchTerm}&filtersParam=${JSON.stringify(filters)}`);
    const resultat = await results.json();

    setSearchResults(resultat.data);
    setIsLoading(false);

    console.log(resultat);
  };

  const sendDataToBatf = (result: SearchResult) => {
    bus.publish(selectSearchBarResultEvent(result));

    console.log("sending data to batf");
    console.log(searchResults);
  };

  function renderResults(results: any, category: string) {

    return results.map((result, index) => {
      let resultTitle = '';
  
      switch (category) {
        case 'events':
        case 'anecdotes':
          if (result.title.length < 1) {
            const date = result.keyDates[0].slice(0,4);
            let content: string = result.content;
  
            if (result.content.length > 30){
              content = result.content.slice(0,30) + "...";
            }
  
            resultTitle = `(${date}) -${content}`;
          }
          else{
            resultTitle = result.title;
          }
          break;
  
        case 'locations':
          resultTitle = result.name;
          break;
  
        case 'historicalPersons':
          var birthYear = result.birthDate.slice(0,4);
          if(!result.deathDate){
            result.deathDate = "aujourd'hui"
          }else{
            var deathYear = result.deathDate.slice(0,4);
          }
          resultTitle = `(${birthYear}-${deathYear}) - ${result.name}`
          break;
  
        case 'users':
          resultTitle = `${result.name}`;
          break;
          
        case 'chains':
          resultTitle = `${result.title}`;
          break;
      }
  
      return (
        <div key={result.id} className="dataItem">
          <button className="dataItem__name" onClick={() => handleClickOnResult(results, category, index)}>{resultTitle}</button>
        </div>
      )
    })
  }

  function rawCategoryToPrintable(category: string){
    switch (category) {
      case 'events':
        return 'Évènements';
      case 'anecdotes':
        return 'Anecdotes';
      case 'locations':
        return 'Lieux';
      case 'historicalPersons':
        return 'Personnes';
      case 'users':
        return 'Utilisateurs';
      case 'chains':
        return 'Chaînes';
    }
  }

  function handleClickOnResult(results: any, category:string, i: number){
    console.log(results[i]);

    switch (category) {
      case 'events':
        bus.publish(selectEventFromSearchBar(results[i] as Fact));
      break;
      case 'historicalPersons':
        bus.publish(selectHistoricalFigureFromSearchBar(results[i] as HistoricalPerson));
        break;
      case 'locations':
        bus.publish(selectLocationFromSearchBar(results[i] as Geometry));
        break;
    }
  }
  

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
                    <span className="category" ><strong>{rawCategoryToPrintable(category)}</strong></span>
                    {renderResults(results, category)}
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
