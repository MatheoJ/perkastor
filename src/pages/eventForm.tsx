// pages/event.tsx
import { useForm } from 'react-hook-form';
import MapCoordPicker from '~/components/MapCoordPicker';

interface EventData {
  name: string;
  coordinatesLat: number;
  coordinatesLong: number;
  description: string;
  dateStart: Date;
  dateEnd: Date;
}



const Event = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EventData>();

  const onSubmit = (data: EventData) => {
    console.log(data);

    window.location.href = "/mapWrapper";
  };

  const handleMapClick = (longitude: number, latitude: number) => {
    setValue('coordinatesLong', longitude.toString());
    setValue('coordinatesLat', latitude.toString());
  };

  return (
    <div className="container" >
      <h1>Ajout d'un évènement</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nom de l'évènement*</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: true })}
        />
        {errors.name && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="description">Description de l'évènement*</label>
        <input
          type="text"
          id="description"
          {...register('description', { required: true })}
        />
        {errors.description && <p className="error-message" >La description est requise.</p>}

        <h3>Coordonées de l'évènement</h3>

        <label htmlFor="coordinatesLong">Longitude*</label>
        <input
          type="text"
          id="coordinatesLong"
          {...register('coordinatesLong', { required: true })}
        />
        {errors.coordinates && <p className="error-message">La longitude est requise.</p>}

        <label htmlFor="coordinatesLat">Latitude*</label>
        <input
          type="text"
          id="coordinatesLat"
          {...register('coordinatesLat', { required: true })}
        />
        {errors.coordinates && <p className="error-message">La latitude est requise.</p>}

        <MapCoordPicker onMapClick={handleMapClick} />

        <label htmlFor="dateStart">Date de début</label>
        <input
          type="date"
          id="dateStart"
          {...register('dateStart', { required: false })}
        />

        <label htmlFor="dateEnd">Date de fin</label>
        <input
          type="date"
          id="dateEnd"
          {...register('dateEnd', { required: false })}
        />


        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Event;
