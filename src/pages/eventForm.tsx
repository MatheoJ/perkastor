// pages/event.tsx
import { Controller, useForm } from 'react-hook-form';
import MapCoordPicker from '~/components/MapCoordPicker';
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import HistoricalFigureList from '~/components/batf/HistoricalFiguresList';
import { useRef, useState } from "react";
import CropperView from "~/components/cropper/CropperView";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button } from '@mui/material';
import { SearchFilters } from 'types/types';

<style jsx>{`
  .button_submit {
    cursor: pointer;
  }
`}</style>
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



const Event = () => {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const MySwal = withReactContent(Swal)
  // need to be authorized to access this page
  const { data: session, status, update } = useSession({
    required: true
  })

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
  const [histFigToDisplay, setHistFigToDisplay] = useState<any[]>([]);
  const [selectedFigures, setSelectedFigures] = useState([]);
  const [imageSrc, setImageSrc] = useState<File | null>(null);
  const ref = useRef<any>();

  const handlelLocationSelected = (locSelected: any) => {
    setLocationSelected(locSelected);
    setValue("coordinatesLong", locSelected.geometry.coordinates[0].toString());
    setValue("coordinatesLat", locSelected.geometry.coordinates[1].toString());
    setValue("NomLieux", locSelected.properties.name);
    setValue("typeLieux", locSelected.properties.type);
    setValue("idLieux", locSelected.properties.id);

  };

  const onSubmit = async (data: EventData) => {

    var selectedFigureId : string[]= selectedFigures.map(elem => elem.id);
    console.log(data);

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
      shortDesc: "",
      content: data.description,
      location: location,
      keyDates: data.listOfDates,
      idHistoricalFigure: selectedFigureId
    };


    setUploading(true);
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
      // change image related to the fact whose id is responseData.id
        if (imageSrc) {

          console.log("Image insérée");
          const image = await ref.current?.triggerUpload(responseData.data.id);

          if (image) {
            setUploading(false);
            // display a sweet alert popup to inform the user of the success
            MySwal.fire({
              title: "Evènement ajouté avec succès",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "Ok",
            }).then(async () => {
              router.push("/mapWrapper");
            })

          } else {
            // display a sweet alert popup to inform the user of the error
            // and ask him if he wants to retry to update the fact's image
            // if he does, call the updateFactImage function again
            // if he doesn't, redirect to his profile page

            MySwal.fire({
              title: "Erreur lors de l'ajout de l'image de l'évènement",
              text: "Voulez-vous réessayer ?",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Réessayer",
              cancelButtonText: "Annuler",
            }).then(async () => {
              const value = await MySwal.fire();
              if (value) {
                setUploading(true);
                const retryUploadImage = await ref.current?.triggerUpload();
                setUploading(false);
                if (retryUploadImage) {
                  // display a sweet alert popup to inform the user of the success
                  MySwal.fire({
                    title: "Evènement ajouté avec succès",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                  }).then(async () => {
                    router.push("/mapWrapper");
                  })
                } else {
                  MySwal.fire({
                    title: "L'image n'a pas pu être ajoutée à l'évènement",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                  }).then(async () => {
                    router.push("/mapWrapper");
                  })
                }
                setUploading(false);
                return;
              }
              router.push("/mapWrapper");
            })
          
          };
      }else{
        console.log("Pas d'image");
        MySwal.fire({
          title: "Evènement ajouté avec succès",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Ok",
        }).then(async () => {
          router.push("/mapWrapper");
        })
      }
    }else{
      MySwal.fire({
        title: "Erreur lors de l'ajout de l'évènement",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "Ok",
      })
    }
  };

  const handleMapClick = (longitude: number, latitude: number) => {
    setValue("coordinatesLong", longitude);
    setValue("coordinatesLat", latitude);
    setValue("NomLieux", "");
    setValue("typeLieux", "");
    setValue("idLieux", "");
  };

  const [query, setQuery] = useState('');

  async function handleSearch(e) {
    var filter : SearchFilters = {
      event: false,
      chain: false,
      historicalFigure: true,
      location: false,
      user: false
    };
    // handle the search query
    e.preventDefault();

    if(query !== ''){
      var queryParams2 = new URLSearchParams({
        query: query,
        filtersParam: JSON.stringify(filter)
      });

      const response2 = await fetch(`/api/search?${queryParams2}`, {
        method: "GET",
      });

      var histfig = await response2.json();
      setHistFigToDisplay(histfig.data.historicalPersons);
    }
  }

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <div className='body-event'>
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
        <textarea
          name="desc"
          cols={40}
          rows={5}
          id="description"
          {...register("description", { required: true })}
          required
        ></textarea>


        {errors.description && (
          <p className="error-message">La description est requise.</p>
        )}

        <h3>Image de l'évènement</h3>
        <CropperView toUpdate='fact' width={150} height={150} defaultFilename='fact.png' defaultFileType='png' alt={'Fait historique'} cropShape='rect' variant='square' uploadOnSubmit={false} ref={ref} imageSrc={imageSrc} setImageSrc={setImageSrc} />

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

      <div>
        <h3>Associer un personnage historique </h3>
        <input type="text" value={query} onChange={handleChange} />
        <Button onClick={handleSearch}>Search</Button>
      </div>
              
      <div title="Historical_People" className="idiv">
        <HistoricalFigureList historicalPersonList={histFigToDisplay} selectedFigures={selectedFigures} setSelectedFigures={setSelectedFigures}/>
      </div>
      
        <Button className='button_submit' id='q1.button' type="submit" disabled={uploading}>Enregistrer</Button>
      </form>

    </div>
    </div>
  );
};


export default Event;
