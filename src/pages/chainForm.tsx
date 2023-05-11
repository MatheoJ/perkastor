// pages/event.tsx
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import MapCoordPicker from '~/components/MapCoordPicker';
import SearchBar from '~/components/searchbar/SearchBar';
import FactChainEdition from '~/components/FactChainEdition';
import { selectFact } from '../events/ChainFormModalEvents';
import { bus } from '../utils/bus';
import { useState, useEffect } from 'react';
import { FactProps } from 'types/types';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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
  const MySwal = withReactContent(Swal)
  // need to be authorized to access this page
  const { data: session, status, update } = useSession({
    required: true
  })

  const onSubmit = (data: ChainDto) => {
    event.preventDefault()
    console.log(data);

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
      console.log("chain handle");
      console.log(event);
      const fact = event.payload;
      setTmpFacts(previous => [...previous, fact]);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="container" >
      <h1>Constitution d'une chaîne</h1>
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

        <h3>Contenu de la chaîne</h3>

        <p>Ajout d'anecdotes historiques déjà existantes</p>
        <SearchBar showChecklist={false} usedInForm={true}></SearchBar>
        <h4>Ordonnancement des anecdotes historiques</h4>
        <FactChainEdition facts={tempFacts} setTmpFacts={setTmpFacts}></FactChainEdition>

        <button type="submit">Envoyer 🚀</button>
      </form>
    </div>
  );
}

export default ChainForm;
