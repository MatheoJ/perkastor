import { createEventDefinition } from "ts-bus";
import { SearchResult } from "types/types";

export const selectSearchBarResultEvent = createEventDefinition<SearchResult>()("searchbar.result.select");