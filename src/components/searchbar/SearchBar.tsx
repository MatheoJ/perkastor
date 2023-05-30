import React, { useState, useRef, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton } from "@mui/material";
import { type FactProps, type SearchFilters, type SearchResult } from 'types/types';
import { bus } from "~/utils/bus";
import { selectEventFromSearchBar, selectHistoricalFigureFromSearchBar, selectLocationFromSearchBar, selectSearchBarResultEvent, selectChainFromSearchBar } from '../../events/SelectSearchBarResultEvent';
import { type Fact, FactChain, type HistoricalPerson } from "@prisma/client";

import { type Geometry } from "geojson";
import FiltersChecklist from "./FiltersChecklist";
import { type NextPage } from "next";
import useOnclickOutside from "react-cool-onclickoutside";
import SearchBarModalResult from "./SearchBarModalResult";
import SearchItem from "./SearchItem";
import { useFocus } from "~/utils/useFocus";

interface Props {
  showChecklist: boolean;
  usedInForm: boolean;
}

const SearchBar: NextPage<Props> = ({ showChecklist, usedInForm }) => {
  const staticResults = React.useRef<SearchResult>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResultsVisibility, setSearchResultsVisibility] = useState<boolean>(false);

  const { ref, handleClick } = useFocus(setSearchResultsVisibility);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalFact, setModalFact] = useState<FactProps>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    event: true,
    historicalFigure: !usedInForm,
    location: !usedInForm,
    chain: !usedInForm,
    user: !usedInForm,
  });

  useEffect(() => {
    // filter searchResults
    const filteredResults: SearchResult = {
      events: [],
      historicalPersons: [],
      locations: [],
      users: [],
      chains: [],
    };

    if (staticResults) {
      if (filters.event) {
        filteredResults.events = staticResults.events;
      }
      if (filters.historicalFigure) {
        filteredResults.historicalPersons = staticResults.historicalPersons;
      }
      if (filters.location) {
        filteredResults.locations = staticResults.locations;
      }
      if (filters.user) {
        filteredResults.users = staticResults.users;
      }
      if (filters.chain) {
        filteredResults.chains = staticResults.chains;
      }
    }

    console.log("RESULTS: ")
    console.log(searchResults)
    console.log("FILTERS: ")
    console.log(filters)
    console.log("STATIC RESULTS: ")
    console.log(staticResults)
    console.log("FILTERED RESULTS")
    console.log(filteredResults)
    setSearchResults(filteredResults);
  }, [filters])

  const ref2 = useOnclickOutside(() => {
    setSearchResultsVisibility(false);
  });

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const results = await fetch(`/api/search?query=${searchTerm}&filtersParam=${JSON.stringify(filters)}`);
    const resultat = await results.json();

    staticResults.current = results.data;

    setSearchResults(resultat.data);
    setIsLoading(false);
    setSearchResultsVisibility(true);
  };

  function renderResults(results: any, category: string) {
    results = Array.isArray(results) ? results : [results]
    return results.map((result, index) => {
      let resultTitle = '';
      let untruncatedText = '';
      let truncated = false;
      switch (category) {
        //case 'anecdotes':
        case 'events':
          if (result.title.length < 1) {
            const date = result.keyDates[0].slice(0, 4);
            let content: string = result.content;

            if (result.content.length > 30) {
              content = result.content.slice(0, 30) + "...";
              truncated = true;
            }

            resultTitle = `(${date}) - ${content}`;
            untruncatedText = `(${date}) - ${result.content}`;
          }
          else {
            resultTitle = result.title;
            untruncatedText = resultTitle;
          }
          break;

        case 'locations':
          resultTitle = result.name;
          untruncatedText = resultTitle;
          break;

        case 'historicalPersons':
          let birthYear: string
          try {
            birthYear = result.birthDate.slice(0, 4);
          } catch (e) {
            birthYear = "?"
          }
          let deathYear: string;
          if (!result.deathDate) {
            deathYear = "aujourd'hui"
          } else {
            try {
              deathYear = result.deathDate.slice(0, 4);
            }
            catch (e) {
              deathYear = "?"
            }
          }
          resultTitle = `(${birthYear}-${deathYear}) - ${result.name}`
          untruncatedText = resultTitle;
          break;
        case 'users':
          resultTitle = `${result.name}`;
          untruncatedText = resultTitle;
          break;
        case 'chains':
          resultTitle = `${result.title}`;
          untruncatedText = resultTitle;
          break;
      }

      return (
        <SearchItem key={result.id} truncated={truncated} text={resultTitle} untruncatedText={untruncatedText} onClick={(event) => {
          handleClickOnResult(event, results, category, index);
          setSearchResultsVisibility(false);
        }} category={category} />
      )
    })
  }

  function rawCategoryToPrintable(category: string) {
    switch (category) {
      case 'events':
        return 'Événements';
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

  function handleClickOnResult(event: MouseEvent, results: any[], category: string, i: number) {
    if (!usedInForm) {
      switch (category) {
        case 'events':
          bus.publish(selectEventFromSearchBar(results[i] as Fact));
          break;
        case 'locations':
          bus.publish(selectLocationFromSearchBar(results[i] as Geometry));
          console.log(results[i]);
          break;
        case 'chains':
          bus.publish(selectChainFromSearchBar(results[i] as Fact[]));
          break;
        case 'historicalPersons':
          bus.publish(selectHistoricalFigureFromSearchBar(results[i] as HistoricalPerson));
          break;
      }
    }
    else {
      event.preventDefault();

      setModalOpen(true);
      setModalFact(results[i] as unknown as FactProps);
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      await handleSubmit();
    }
  };


  return (
    <div className={`searchbar active ${usedInForm ? 'searchbar-form' : ''}`} ref={ref2}>
      <div className="searching-area" style={{ borderRadius: `5px 5px ${searchResultsVisibility && searchResults && Object.entries(searchResults).length > 0 ? '0 0' : '5px 5px'}` }}>
        <div className="row">
          <div className={`searchBar__form`} style={{ width: usedInForm ? '100%' : 'auto' }}>
            <input
              type="text"
              className="searchBar__input"
              placeholder="Chercher une anecdote, un lieu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchResults();
              }}
              ref={ref}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            />
          </div>
          {isLoading && <div className="loading" ><CircularProgress size={18} color="inherit" /></div>}
          <IconButton onClick={async () => {
            await handleSubmit();
          }}>
            <SearchIcon />
          </IconButton>
        </div>
        <div className="row">
          {showChecklist ?
            <div className="checklist-area">
              <FiltersChecklist filters={filters} setFilters={setFilters} />
            </div> : null
          }
        </div>
      </div>
      {searchResultsVisibility && searchResults && searchResults.length > 0 && Object.values(searchResults).some(cat => cat.length > 0) && (
        <div className="searchResults">
          <div className="searchResults-content">

            {Object.entries(searchResults).map(([category, results]) => (
              <React.Fragment key={category}>
                {results.length > 0 && (
                  <React.Fragment>
                    {!usedInForm ? <span className="category" >{rawCategoryToPrintable(category)}</span> : ''}
                    {renderResults(results, category)}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {
        modalOpen &&
        <SearchBarModalResult fact={modalFact} open={modalOpen} setOpen={setModalOpen} />
      }
    </div >
  );
}

export default SearchBar;
