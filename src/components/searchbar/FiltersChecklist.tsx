// créer un composant FiltersChecklist.tsx
//
// Path: src\components\searchbar\FiltersChecklist.tsx

import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, Typography } from '@mui/material';
import { SearchFilters } from 'types/types';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EventIcon from '@mui/icons-material/Event';
import Person4Icon from '@mui/icons-material/Person4';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
interface Props {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
}

function FiltersChecklist({ filters, setFilters }: Props) {
    const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
    const [localFilters, setLocalFilters] = useState(filters);
    const [alignment, setAlignment] = React.useState<string | null>('left');

    const handleFilterChange = (filterName: keyof SearchFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFilters = { ...localFilters, [filterName]: event.target.checked };
      setLocalFilters(updatedFilters);
      setFilters(updatedFilters);
      console.log(updatedFilters);
    };

    const handleFormat = (
        event: React.MouseEvent<HTMLElement>,
        newFormats: string[],
      ) => {
        setFormats(newFormats);
      };

    return (
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="filters for search results"
        >
          <ToggleButton value="event" aria-label="include events">
            <EventIcon />
          </ToggleButton>
          <ToggleButton value="chains" aria-label="include chains">
            <LinkIcon/>
          </ToggleButton>
          <ToggleButton value="hfigures" aria-label="include historical figures">
            <Person4Icon/>
          </ToggleButton>
          <ToggleButton value="users" aria-label="include users">
            <PersonIcon/>
          </ToggleButton>
        </ToggleButtonGroup>
      );

}

export default FiltersChecklist;