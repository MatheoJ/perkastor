// pages/event.tsx
import { Controller, set, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import MapCoordPicker from '~/components/MapCoordPicker';
import { list } from 'postcss';
import DatePicker from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import HistoricalFigure from "../components/batf/HistoricalFiguresView";
import HistoricalFigureList from '~/components/batf/HistoricalFiguresList';
import { useRef, useState } from "react";
import CropperView from "~/components/cropper/CropperView";
import swal from '@sweetalert/with-react';
import { useRouter } from "next/router";

interface EventData {
  name: string;
  typeLieux: string;
  NomLieux: string;
  idLieux: string;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<EventData>();
  const [locationSelected, setLocationSelected] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const ref = useRef<any>();

  const handlelLocationSelected = (locSelected: any) => {
    setLocationSelected(locSelected);
    setValue("coordinatesLong", locSelected.geometry.coordinates[0].toString());
    setValue("coordinatesLat", locSelected.geometry.coordinates[1].toString());
    setValue("NomLieux", locSelected.properties.name);
    setValue("typeLieux", locSelected.properties.type);
    setValue("idLieux", locSelected.properties.id);

    console.log(watch("listOfDates"));
  };

  const onSubmit = async (data: EventData) => {
    var dataEvent;
    var location = {
      id: data.idLieux,
      name: data.NomLieux,
      type: data.typeLieux,
      latitude: data.coordinatesLat,
      longitude: data.coordinatesLong,
      area: 0
    };
    dataEvent = {
      title: data.name,
      shortDesc: data.description,
      content: data.description,
      location: location,
      keyDates: data.listOfDates
    };

    const response = await fetch('/api/facts', {
      method: 'POST',
      body: JSON.stringify(dataEvent),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // if response is ok, update the fact's image
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      // change image related to the fact whose id is responseData.id
      const image = await ref.current?.triggerUpload(responseData.id);
      if (!image) {
        // display a sweet alert popup to inform the user of the error
        // and ask him if he wants to retry to update the fact's image
        // if he does, call the updateFactImage function again
        // if he doesn't, redirect to his profile page

        swal.fire({
          title: "Erreur lors de l'ajout de l'image de l'évènement",
          text: "Voulez-vous réessayer ?",
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Réessayer",
          cancelButtonText: "Annuler",
        }).then((value) => {
          switch (value) {
            case "retry":
              ref.current?.triggerUpload();
              break;
            case "cancel":
              // use router to redirect to the profile page
              useRouter().push("/profile");
              break;
            default:
              useRouter().push("/profile");
              break;
          }
        })
      };
    }
  }

  const handleMapClick = (longitude: number, latitude: number) => {
    setValue("coordinatesLong", longitude);
    setValue("coordinatesLat", latitude);
    setValue("NomLieux", "");
    setValue("typeLieux", "");
    setValue("idLieux", "");
  };

  return (
    <div className="container">
      <h1>Ajout d'un évènement</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nom de l'évènement*</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
        />
        {errors.name && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="description">Description de l'évènement*</label>
        <input
          type="text"
          id="description"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="error-message">La description est requise.</p>
        )}

        <h3>Image de l'évènement</h3>
        <CropperView toUpdate='fact' width={150} height={150} defaultFilename='fact.png' defaultFileType='png' alt={'Fait historique'} cropShape='rect' variant='square' uploadOnSubmit={false} ref={ref} />

        <h3>Lieu de l'évènement</h3>
        <MapCoordPicker onMapClick={handleMapClick} locSelected={locationSelected} onLocationSelect={handlelLocationSelected} />
        <label htmlFor="NomLieux">Nom du lieu*</label>
        <input
          type="text"
          id="NomLieux"
          {...register("NomLieux", { required: true })}
          onChange={() => {
            setValue("idLieux", "");
          }}
        />
        {errors.name && <p className="error-message">Le nom est requis.</p>}

        <label htmlFor="typeLieux">Type du lieu*</label>
        <select
          id="typeLieux"
          {...register("typeLieux", { required: true })}
          onChange={() => {
            setValue("idLieux", "");
          }}
        >
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
          {...register("coordinatesLong", { required: true })}
          onChange={() => {
            setValue("idLieux", "");
          }}
        />
        {errors.coordinatesLong && (
          <p className="error-message">La longitude est requise.</p>
        )}

        <label htmlFor="coordinatesLat">Latitude*</label>
        <input
          type="text"
          id="coordinatesLat"
          {...register("coordinatesLat", { required: true })}
          onChange={() => {
            setValue("idLieux", "");
          }}
        />
        {errors.coordinatesLat && (
          <p className="error-message">La latitude est requise.</p>
        )}

        <label htmlFor="idLieux">Id du Lieu</label>
        <input type="text" id="idLieux" {...register("idLieux")} readOnly />

        
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
              plugins={[<DatePanel />]}
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
