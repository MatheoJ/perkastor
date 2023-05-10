// pages/event.tsx
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import MapCoordPicker from '~/components/MapCoordPicker';

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

  const router = useRouter();

  const onSubmit = (data: ChainDto) => {
    console.log(data);
    router.push('/mapWrapper');
  };

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

        <input
          type="text"
          id="search-event"
          placeholder="Prise de la Bastille"
          {...register('searchEvent', { required: false })}
        />
        {/*<FactList filter="search-event"></FactList>*/}

        <button type="submit">Envoyer 🚀</button>
      </form>s
    </div>
  );
};

export default ChainForm;
