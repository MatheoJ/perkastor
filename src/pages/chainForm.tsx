import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MapCoordPicker from '~/components/MapCoordPicker';
import SearchBar from '~/components/searchbar/SearchBar';
import FactChainEdition from '~/components/FactChainEdition';
import { selectFact } from '../events/ChainFormModalEvents';
import { bus } from '../utils/bus';
import { FactProps } from 'types/types';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ChainDto {
  title: string;
  description: string;
  authorId: string;
  factItems: {
    title: string;
    comment: string;
    factId: string;
  }[];
}

const ChainForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ChainDto>();
  const [tempFacts, setTmpFacts] = useState([]);
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  // need to be authorized to access this page
  const { data: session, status, update } = useSession({
    required: true,
  });

  const onSubmit = (data: ChainDto) => {
    event.preventDefault();

    const chain = {
      title: data.title,
      description: data.description,
      authorId: session.user.id,
      factItems: tempFacts.map(fact => {
        return {
          title: "",
          comment: "",
          factId: fact.id
        }
      })
    };

    fetch('/api/chains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chain)
    }).then(async (response) => {
      if (response.status < 300) {
        await Swal.fire({
          title: 'Chaîne créée !',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        router.push('/mapWrapper');
      } else {
        await Swal.fire({
          title: 'Erreur lors de la création de la chaîne',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
  };

  useEffect(() => {
    const unsub = bus.subscribe(selectFact, event => {
      const fact = event.payload;
      setTmpFacts(previous => [...previous, fact]);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className='body-event'>
    <div className="container" >
      <h1>Constitution d'une chaîne</h1>
      <p>Qu'est-ce qu'une <strong>chaîne</strong> ?</p>
      <p>Une chaîne est une succession d'anecdotes historiques qui se suivent chronologiquement. Contribuer à l'écosystème permet de partager les événements qui vous tiennent à coeur.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nom de la chaîne</label>
        <input
          type="text"
          id="name"
          placeholder="La Révolution Française"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="description">Description de la chaîne</label>
        <input
          type="text"
          id="description"
          placeholder="La commune de Paris est ..."
          {...register('description', { required: true })}
        />
        {errors.description && <p className="error-message" >La description est requise.</p>}

        <label>Recherche des événements</label>
        <SearchBar showChecklist={false} usedInForm={true}></SearchBar>
        <label>Constitution de la chaîne</label>
        <FactChainEdition facts={tempFacts} setTmpFacts={setTmpFacts}></FactChainEdition>

        
        <button type="submit">Envoyer 🚀</button>
      </form>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
    </div>
  );
}

export default ChainForm;
