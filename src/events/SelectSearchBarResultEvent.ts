import { createEventDefinition } from "ts-bus";
import { SearchResult } from "types/types";
import { Fact, HistoricalPerson } from "@prisma/client";
import {Geometry} from 'geojson';

export const selectSearchBarResultEvent = createEventDefinition<SearchResult>()("searchbar.result.select");

export const selectEventFromSearchBar = createEventDefinition<Fact>()("searchbar.select.event");
export const selectHistoricalFigureFromSearchBar = createEventDefinition<HistoricalPerson>()("searchbar.select.hfigure");
export const selectLocationFromSeachBar = createEventDefinition<Geometry>()("searchbar.select.hfigure");