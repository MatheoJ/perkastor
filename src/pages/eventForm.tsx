// pages/event.tsx
import { Controller, set, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import MapCoordPicker from '~/components/MapCoordPicker';
import { list } from 'postcss';
import DatePicker from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import HistoricalFigure from "../components/batf/HistoricalFiguresView";
import HistoricalFigureList from '~/components/batf/HistoricalFiguresList';

interface EventData {
  name: string;
  typeLieux: string;
  NomLieux : string;
  idLieux : string;
  coordinatesLat: number;
  coordinatesLong: number;  
  description: string;
  listOfDates: string;
  idHistoricalFigure: string[];
}

const fact = {
  id: "1",
  isEvent:true,
  createdAt: new Date(1990, 4, 7),
  updatedAt: new Date(1990, 4, 7),
  title: "Sample Fact Title",
  shortDesc: "This is a short description of the fact.",
  content: "This is the full content of the fact.",
  keyDates: [new Date(1990, 4, 7)],
  bannerImg: "",
  verified: true,
  video: [],
  audio: [],
  authorId: "oui",
  locationsId:"",
  sources:[]
}


const histFig1 = {
  id: "1",
  name: "Pierre Paul Jacques",
  birthDate: new Date(1990, 4, 7),
  deathDate: new Date(1985, 4, 7),
  image: "",
  shortDesc: "C'est moi !",
  content: "coucou",
  facts:[fact]
};

const histFig2 = {
  id: "2",
  name: "Pierpoljak",
  birthDate: new Date(1990, 4, 7),
  deathDate: new Date(1985, 4, 7),
  image: "",
  shortDesc: "C'est moi !",
  content: "coucou",
  facts:[fact]
};

const histFig3 = {
  id: "3",
  name: "Test",
  birthDate: new Date(1990, 4, 7),
  deathDate: new Date(1985, 4, 7),
  image: "",
  shortDesc: "C'est moi !",
  content: "coucou",
  facts:[fact]
};

const histFigList = [histFig1, histFig2, histFig3]


const Event = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<EventData>();
  const [locationSelected, setLocationSelected] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);



  const handlelLocationSelected = (locSelected : any) => {
    setLocationSelected(locSelected);
    setValue('coordinatesLong', locSelected.geometry.coordinates[0].toString());
    setValue('coordinatesLat', locSelected.geometry.coordinates[1].toString());
    setValue('NomLieux', locSelected.properties.name);
    setValue('typeLieux', locSelected.properties.type);
    setValue('idLieux', locSelected.properties.id);

    console.log(watch('listOfDates'))
  };

  const onSubmit = (data: EventData) => {
    

    console.log(data);

  };

  const handleMapClick = (longitude: number, latitude: number) => {
    setValue('coordinatesLong', longitude.toString());
    setValue('coordinatesLat', latitude.toString());
    setValue('NomLieux', '');
    setValue('typeLieux', '');
    setValue('idLieux', '');

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

        <h3>Lieu de l'évènement</h3>
        <MapCoordPicker onMapClick={handleMapClick} locationSelected={locationSelected} onLocationSelect={handlelLocationSelected} />
        <label htmlFor="NomLieux">Nom du lieu*</label>
        <input
          type="text"
          id="NomLieux"
          {...register('NomLieux', { required: true })}
          onChange={() => { setValue('idLieux', '') }}
        />
        {errors.name && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="typeLieux">Type du lieu*</label>
        <select id="typeLieux" {...register('typeLieux', { required: true })}  onChange={() => { setValue('idLieux', '') }}>
          <option value="">Select...</option>
          <option value="rue">Rue, Place, etc</option>
          <option value="ville">Ville</option>
          <option value="departement">Department</option>
          <option value="region">Region</option>
        </select>
        {errors.name && <p className="error-message">Le type est requis.</p>}

        <label htmlFor="coordinatesLong">Longitude*</label>
        <input
          type="text"
          id="coordinatesLong"
          {...register('coordinatesLong', { required: true })}
          onChange={() => { setValue('idLieux', '') }}
        />
        {errors.coordinatesLong && <p className="error-message">La longitude est requise.</p>}

        <label htmlFor="coordinatesLat">Latitude*</label>
        <input
          type="text"
          id="coordinatesLat"
          {...register('coordinatesLat', { required: true })}
          onChange={() => { setValue('idLieux', '') }}
        />
        {errors.coordinatesLat && <p className="error-message">La latitude est requise.</p>}

        <label htmlFor="idLieux">Id du Lieu</label>
        <input
          type="text"
          id="idLieux"
          {...register('idLieux')}
          readOnly
          
        />

        

        <h3>Dates de l'évènement</h3>
      <Controller
        name="listOfDates"
        control={control}
        render={({ field }) => (
          <DatePicker
            format="DD/MM/YYYY"
            value={selectedDates}
            onChange={(dates) => {
              setSelectedDates(dates);
              field.onChange(dates);
            }}
            plugins={[
              <DatePanel />
             ]}
          />
        )}
      />

      <h3>Résultats de la recherche des Personnages Historiques associés</h3>
      <div title="Historical_People" className="idiv">
        <HistoricalFigureList historicalPersonList={histFigList}/>
      </div>
        <button className='button_submit' id='q1.button' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Event;
