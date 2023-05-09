import { Geometry } from "geojson";
import { createEventDefinition } from "ts-bus";
import { Feature } from "geojson";
export const selectMapEvent = createEventDefinition<Feature<Geometry>>()("map.marker.select");