// créer un composant FiltersChecklist.tsx
//
// Path: src\components\searchbar\FiltersChecklist.tsx

import React, { useState } from 'react';
import { type SearchFilters } from 'types/types';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LinkIcon from '@mui/icons-material/Link';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import PinDropIcon from '@mui/icons-material/PinDrop';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { type NextPage } from 'next';
interface Props {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
}

const FiltersChecklist: NextPage<Props> = ({ filters, setFilters }) => {
    const FONT_SIZE = '0.7rem';
    const WRAP_MODE = 'break-spaces';
    const BUTTON_WIDTH = 75;
    const WORD_BREAK = 'break-all';
    const [localFilters, setLocalFilters] = useState(Object.keys(filters).map(key => filters[key] ? key : '').filter(key => key !== ''));

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, filterNames: string[]) => {
        setLocalFilters(filterNames);
        const newFilters: SearchFilters = {
            event: false,
            chain: false,
            historicalFigure: false,
            location: false,
            user: false,
        };
        newFilters.event = filterNames.indexOf('event') > -1;
        newFilters.chain = filterNames.indexOf('chain') > -1;
        newFilters.historicalFigure = filterNames.indexOf('historicalFigure') > -1;
        newFilters.location = filterNames.indexOf('location') > -1;
        newFilters.user = filterNames.indexOf('user') > -1;
        setFilters(newFilters);
    }

    return (
        <ToggleButtonGroup
            color="primary"
            value={localFilters}
            onChange={handleFilterChange}
            aria-label="Type"
            fullWidth={true}
        >
            <ToggleButton value="event" aria-label="Événements" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}><AutoStoriesIcon /></ToggleButton>
            <ToggleButton value="chain" aria-label="Chaine d&apos;Événements" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}><LinkIcon /></ToggleButton>
            <ToggleButton value="historicalFigure" aria-label="Personnages Historiques" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}><PsychologyAltIcon /></ToggleButton>
            <ToggleButton value="location" aria-label="Lieux" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}><PinDropIcon /></ToggleButton>
            <ToggleButton value="user" aria-label="Utilisateurs" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}><AccountCircleIcon /></ToggleButton>
        </ToggleButtonGroup>
    );

}

export default FiltersChecklist;