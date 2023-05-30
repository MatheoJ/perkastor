import { type Geometry } from "geojson";
import { createEventDefinition } from "ts-bus";
import { type Feature } from "geojson";
export const selectMapEvent = createEventDefinition<Feature<Geometry>>()("map.marker.select");