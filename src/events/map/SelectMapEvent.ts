import { createEventDefinition } from "ts-bus";

export const selectMapEvent = createEventDefinition<{
    lat: number;
    lng: number;
}>()("map.marker.select");