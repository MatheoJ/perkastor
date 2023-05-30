import { createEventDefinition } from "ts-bus";
import { SearchResult } from "types/types";
import {Geometry} from 'geojson';
import { Fact, HistoricalPerson, Location } from "@prisma/client";

export const selectSearchBarResultEvent = createEventDefinition<SearchResult>()("searchbar.result.select");

export const selectEventFromSearchBar = createEventDefinition<Fact>()("searchbar.select.event");
export const selectHistoricalFigureFromSearchBar = createEventDefinition<HistoricalPerson>()("searchbar.select.hfigure");
export const selectLocationFromSearchBar = createEventDefinition<Geometry>()("searchbar.select.location");
export const selectChainFromSearchBar = createEventDefinition<Fact[]>()("searchbar.select.chain");
export const selectLocationItem = createEventDefinition<Location>()("searchbar.select.location.item");