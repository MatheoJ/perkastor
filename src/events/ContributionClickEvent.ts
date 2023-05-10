import { bool } from "aws-sdk/clients/signer";
import { createEventDefinition } from "ts-bus";
export const contributionClickEvent = createEventDefinition<boolean>()("editMod");