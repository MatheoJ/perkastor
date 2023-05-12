import { createEventDefinition } from "ts-bus";
import { SearchResult } from "types/types";
import {Geometry} from 'geojson';

export const selectSearchBarResultEvent = createEventDefinition<SearchResult>()("searchbar.result.select");

export const selectEventFromSearchBar = createEventDefinition<Fact>()("searchbar.select.event");
export const selectHistoricalFigureFromSearchBar = createEventDefinition<HistoricalPerson>()("searchbar.select.hfigure");
export const selectLocationFromSearchBar = createEventDefinition<Geometry>()("searchbar.select.location");
export const selectChainFromSearchBar = createEventDefinition<Fact[]>()("searchbar.select.chain");
export const selectLocationItem = createEventDefinition<Geometry>()("searchbar.select.location.item");