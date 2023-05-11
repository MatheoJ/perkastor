import React, { useState, useRef, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from "@mui/material";
import { SearchFilters, SearchResult } from 'types/types';
import { bus } from "~/utils/bus";
import {selectEventFromSearchBar, selectHistoricalFigureFromSearchBar, selectLocationFromSearchBar, selectSearchBarResultEvent} from '../../events/SelectSearchBarResultEvent';
import {HistoricalPerson, FactPrisma} from "@prisma/client";

import {FactProps} from 'types/types';

import Fact from "../Fact";


import {Geometry} from "geojson";
import FiltersChecklist from "./FiltersChecklist";
import { NextPage } from "next";

import SearchBarModalResult from "./SearchBarModalResult";

interface Props{
  showChecklist: boolean;
  usedInForm: boolean;
}

const SearchBar: NextPage<Props> = ({ showChecklist, usedInForm }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { ref, handleClick } = useFocus();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalFact, setModalFact] = useState<FactPrisma>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    event: true,
    historicalFigure: !usedInForm,
    location: !usedInForm,
    chain: !usedInForm,
    user: !usedInForm,
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
          var birthYear
          try{
            birthYear = result.birthDate.slice(0,4);
          }catch(e){
            birthYear = "????"
          }
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
    if (!usedInForm){
      switch (category) {
        case 'events':
          bus.publish(selectEventFromSearchBar(results[i] as FactPrisma));
        break;
      case 'locations':
        bus.publish(selectLocationFromSearchBar(results[i] as Geometry));
        break;
      case 'chains':
        bus.publish(selectChainFromSearchBar(results[i] as FactChain));
    }
    else{
      event.preventDefault();

      setModalOpen(true);
      setModalFact(results[i]);

      console.log(modalFact);
      console.log(modalOpen);
    }
  }
  
  return (
    <div className={`searchbar active ${usedInForm ? 'searchbar-form' : ''}`}>
      <div className="searching-area">
        <div className="searchBar__form">
          <input
            type="text"
            className="searchBar__input"
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
        <div className="searchResults">
          <div className="searchResults-content">
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
      {
        modalOpen &&
        <SearchBarModalResult fact={modalFact} open={modalOpen} setOpen={setModalOpen} />
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

export default SearchBar;
