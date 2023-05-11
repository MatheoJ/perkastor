// pages/event.tsx
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import MapCoordPicker from '~/components/MapCoordPicker';
import SearchBar from '~/components/searchbar/SearchBar';
import FactChainEdition from '~/components/FactChainEdition';
import {selectFact} from '../events/ChainFormModalEvents';
import {bus} from '../utils/bus';
import { useState, useEffect } from 'react';
import { FactProps } from 'types/types';

interface ChainDto {
  name: string;
  coordinatesLat: number;
  coordinatesLong: number;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  access: boolean;
  tags: string[];
  historicalFigures: string[];
  facts: string[];
  contributions: string[];
  searchEvent: string;
}

const ChainForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ChainDto>();
  const [tempFacts, addTmpFacts] = useState<FactProps[]>([]);
  const router = useRouter();

  const onSubmit = (data: ChainDto) => {
    event.preventDefault()

    console.log(data);

    router.push('/mapWrapper');
  };

  useEffect(() => {
    bus.subscribe(selectFact, event => {
      console.log("chain handle");
      console.log(event);

      const fact = event.payload;

      addTmpFacts([...tempFacts, fact]);
      //setModalOpen(false);
    });
  });

  return (
    <div className="container" >
      <h1>Constitution d&apo;sune chaîne</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nom de la chaîne</label>
        <input
          type="text"
          id="name"
          placeholder="La Révolution Française"
          {...register('name', { required: true })}
        />
        {errors.name && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="description">Description de la chaîne</label>
        <input
          type="text"
          id="description"
          placeholder="La commune de Paris est ..."
          {...register('description', { required: true })}
        />
        {errors.description && <p className="error-message" >La description est requise.</p>}
        
        <label htmlFor="access">Visibilité publique</label>
        <input
          type="checkbox"
          id="access"
          value="Accès publique"
          {...register('access')}
        />

        <h3>Contenu de la chaîne</h3>

        <p>Ajout d&apos;événements déjà existants</p>

        <SearchBar showChecklist={false} usedInForm={true}></SearchBar>

        <h4>Ordonnancement des événements</h4>

        <FactChainEdition facts={tempFacts}></FactChainEdition>

        <button type="submit">Envoyer 🚀</button>
      </form>
    </div>
  );
};

export default ChainForm;
