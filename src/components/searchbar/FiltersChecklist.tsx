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
interface Props {
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
}

function FiltersChecklist({ filters, setFilters }: Props) {
    const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
    const [localFilters, setLocalFilters] = useState(filters);

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
      <div className='filters-checklist'>
      <label className="container-checkbox">
          Évènements
          <input type="checkbox" checked={localFilters.event} 
              onChange={handleFilterChange('event')}/>
          <span className="checkmark" />
      </label>
      <label className="container-checkbox">
          Chaine d'évènements
          <input type="checkbox" checked={localFilters.chain}  
              onChange={handleFilterChange('chain')}/>
          <span className="checkmark" />
      </label>
      <label className="container-checkbox">
          Personnages historiques
          <input type="checkbox" checked={localFilters.historicalFigure}
              onChange={handleFilterChange('historicalFigure')}/>
          <span className="checkmark" />
      </label>
      <label className="container-checkbox">
          Lieux
          <input type="checkbox" checked={localFilters.location}
              onChange={handleFilterChange('location')}/>
          <span className="checkmark" />
      </label>
  </div>
      );

}

export default FiltersChecklist;