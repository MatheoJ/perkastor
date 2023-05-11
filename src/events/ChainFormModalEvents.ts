import { createEventDefinition } from "ts-bus";
import { FactProps } from 'types/types';

export const selectFact = createEventDefinition<FactProps>()("chainForm.addFact");
