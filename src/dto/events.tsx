import { bool } from "aws-sdk/clients/signer";

interface EventDto {
    name: string;
    coordinatesLat: number;
    coordinatesLong: number;
    description: string;
    dateStart: Date;
    dateEnd: Date;
}

interface FactChainItemDto{
    id: string;
    position: number;
    title?: string;
    factChainId: string;
    comment?: string;
    factId: string;
}

interface FactChainDto {
    name: string;
    description: string;
    visibility: bool; //public | private
    factChainItemDto: FactChainDto[];
}