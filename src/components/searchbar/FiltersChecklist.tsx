// créer un composant FiltersChecklist.tsx
//
// Path: src\components\searchbar\FiltersChecklist.tsx

import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, Typography } from '@mui/material';
import { type SearchFilters } from 'types/types';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EventIcon from '@mui/icons-material/Event';
import Person4Icon from '@mui/icons-material/Person4';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import { NextPage } from 'next';
interface Props {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
}

const FiltersChecklist: NextPage<Props> = ({ filters, setFilters }) => {
    const FONT_SIZE = '0.7rem';
    const WRAP_MODE = 'break-spaces';
    const BUTTON_WIDTH = 75;
    const WORD_BREAK = 'break-all';
    const [localFilters, setLocalFilters] = useState(['event', 'chain', 'historicalFigure', 'location', 'user']);

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
            <ToggleButton value="event" aria-label="event" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}>Événements</ToggleButton>
            <ToggleButton value="chain" aria-label="chain" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}>Chaine d&apos;Événements</ToggleButton>
            <ToggleButton value="historicalFigure" aria-label="historicalFigure" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}>Personnages Historiques</ToggleButton>
            <ToggleButton value="location" aria-label="location" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}>Lieux</ToggleButton>
            <ToggleButton value="user" aria-label="user" style={{ fontSize: FONT_SIZE, wordBreak: WORD_BREAK, whiteSpace: WRAP_MODE }} sx={{ width: BUTTON_WIDTH }}>Utilisateurs</ToggleButton>
        </ToggleButtonGroup>
    );

}

export default FiltersChecklist;