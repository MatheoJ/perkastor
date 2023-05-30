import { createEventDefinition } from "ts-bus";
import { type FactProps } from 'types/types';

export const selectFact = createEventDefinition<FactProps>()("chainForm.addFact");
