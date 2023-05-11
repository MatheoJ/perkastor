import React, { useState, useRef, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from "@mui/material";
import { SearchFilters, SearchResult } from 'types/types';
import { bus } from "~/utils/bus";
import {selectEventFromSearchBar, selectHistoricalFigureFromSearchBar, selectLocationFromSearchBar, selectSearchBarResultEvent} from '../../events/SelectSearchBarResultEvent';
import {HistoricalPerson} from "@prisma/client";

import {FactProps} from 'types/types';

import Fact from "../Fact";


import {Geometry} from "geojson";
import FiltersChecklist from "./FiltersChecklist";
import { NextPage } from "next";


interface Props{
  showChecklist: boolean;
  usedInForm: boolean;
  onResultClick : (locSelected : any) => void; 
}

const SearchBarLieu: NextPage<Props> = ({ showChecklist, usedInForm, onResultClick }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ref, handleClick } = useFocus();


  const [filters, setFilters] = useState<SearchFilters>({
    event: false,
    historicalFigure: false,
    location: true,
    chain: false,
    user: false,
  });

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSubmit = async () => {
    //e.preventDefault();
    console.log("test");
    setIsLoading(true);
    
    // passer les parametres sélectionnés comme filtre puis ajouter &filtersParam=${JSON.stringify({})} a la fin de l'url
    const results = await fetch(`/api/search?query=${searchTerm}&filtersParam=${JSON.stringify(filters)}`);
    const resultat = await results.json();

    console.log("résultat api");
    console.log(results);
    setSearchResults(resultat.data);
    setIsLoading(false);
  };

  function renderResults(results: any[], category: string) {
    return results.map((result, index) => {
      let resultTitle = '';
      switch (category) {
        //case 'anecdotes':
        case 'events':
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
          var deathYear = result.deathDate.slice(0,4);
  
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
          <button className="dataItem__name" onClick={(event) => handleClickOnResult(event, results, category, index)} category={category}>{resultTitle}</button>
        </div>
      )
    })
  }

  function rawCategoryToPrintable(category: string){
    switch (category) {
      case 'events':
        return 'Évènements';
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

  function handleClickOnResult(event, results: any, category:string, i: number){
    onResultClick(results[i]);
    event.preventDefault();
  }
  

  return (
    <div className={`searchbarlieux active ${usedInForm ? 'searchbar-form' : ''}`}>
      <div className="searching-area">
        <div className="searchBarlieux__form">
          <input
            type="text"
            className="searchBarlieux__input"
            placeholder="Chercher un évènement, un lieu..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchResults([]);
            }}
            ref={ref}
            onClick={handleClick}
           // onSubmit={() => {handleSubmit}}
          />

        </div>
        {isLoading && <div className="loading" ><CircularProgress size={24} color="inherit" /></div>}
        <IconButton onClick={async () => {
          await handleSubmit();
      }}>
        <SearchIcon />
      </IconButton>
      </div>
      {searchResults && Object.values(searchResults).some(cat => cat.length > 0) && (
        <div className="searchResultslieu">
          <div className="searchResultslieu-content">
            {Object.entries(searchResults).map(([category, results]) => (
              <React.Fragment key={category}>
                {results.length > 0 && (
                  <React.Fragment>
                    {!usedInForm ? <span className="category" ><strong>{rawCategoryToPrintable(category)}</strong></span> : ''}
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


export const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleClick = () => {
    if (ref.current) {
      ref.current.focus();

      ref.current.style 
    }
  };

  return { ref, handleClick };
};

export default SearchBarLieu;