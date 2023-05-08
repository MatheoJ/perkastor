import { Edit } from '@mui/icons-material';
import { Avatar, Badge, Button, IconButton, Slider } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getCroppedImg from './cropImage';
import axios from 'axios';

function UserProfile() {
  const [formSuccess, setFormSuccess] = useState<string>();
  const [formError, setFormError] = useState<string>();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  const { data: session, status, update } = useSession({
    required: false
  })

  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [update])

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === "visible" && update()
    window.addEventListener("visibilitychange", visibilityHandler, false)
    return () => window.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [update])

  async function changePasswordHandler(passwordData: string) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      setFormError(data.message || 'Erreur lors de la mise à jour du mot de passe. Veuillez réessayer plus tard.');
      setFormSuccess('');
    } else if (formError !== '') {
      setFormError('');
      setFormSuccess('Votre mot de passe a été mis à jour avec succès !')
    }
  }

  const [error, setError] = useState("")
  const [uploadState, setUploadState] = useState({});
  const profileImageRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [imageSrc, setImageSrc] = useState<File | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState("")
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [cropAreaPixels, setCropAreaPixels] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels)
      setCropAreaPixels(croppedAreaPixels)
    },
    []
  );

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name.split(' ').length > 1 ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name.substring(0, 2)
    }
  }

  async function handleUpload(e: MouseEvent) {
    e.preventDefault()
    console.log('start of upload')
    // async magic goes here...
    if (imageSrc === undefined) {
      setFormError("Veuillez sélectionner une image.")
      console.error(`not an image, the image file is a ${typeof (imageUrl)}`)
      return
    } else {
      setFormError("")
    }

    let fileToUpload = await getCroppedImg(imageUrl, cropAreaPixels, 0, {
      horizontal: false,
      vertical: false
    }) as Blob

    const fileName = imageUrl.split('/').pop() || "profile.png"
    const fileType = fileName.split('.').pop() || "png"

    // Patch the file information to the server to obtain a signed URL
    axios
      .patch("/api/user/image", {
        fileName: fileName,
        fileType: fileType,
      })
      .then((res) => {
        const signedRequest = res.data.signedRequest;
        const url = res.data.url;
        setUploadState({
          ...uploadState,
          url,
        });

        // Perform the actual upload using the signed URL
        const options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        axios
          .put(signedRequest, fileToUpload, options)
          .then((_) => {
            setUploadState({ ...uploadState, success: true });
            setAvatarUrl(url)
            setImageSrc(undefined)
            setImageUrl("")
            setFormError("")
          })
          .catch((_) => {
            setFormError("Nous n'avons pas pu téléverser votre image.")
          });
      })
      .catch((error) => {
        setFormError("Nous n'avons pas pu téléverser votre image: " + error)
      });
  }



  return (
    <section className={classes.profile}>
      <div>
        <div className={"error flex flex-center"}><p className={"error"}>{formError}</p></div>
        <input ref={profileImageRef} hidden accept="image/*" type="file" onChange={(event) => {
          if (event.target.files) {
            console.log(event.target.files[0])
            setImageSrc(event.target.files[0])
            setImageUrl(URL.createObjectURL(event.target.files[0]))
          }
        }}
        />
        <Badge
          onClick={() => {
            profileImageRef?.current?.click()
          }}
          overlap={"circular"}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <IconButton aria-label={"edit profile picture"}

              sx={{
                backgroundColor: 'white',
              }} onClick={() => {
                profileImageRef?.current?.click()
              }}>
              <Edit fontSize={"small"} />
            </IconButton>
          }>
          {avatarUrl ? <Avatar alt={session.user.email!} src={avatarUrl} sx={{ width: 92, height: 92 }} /> :
            <Avatar {...stringAvatar(session.user.email!)} sx={{ width: 92, height: 92 }} />}
        </Badge>
      </div>

      {
        imageSrc ?
          <>
            <div className="crop-container">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="controls">
              <Button className="picture-button" variant={"contained"} color={"error"}
                startIcon={<CancelIcon />} onClick={() => {
                  setImageSrc(undefined);
                  setImageUrl("")
                }}>CANCEL</Button>
              <Slider
                id={"zoom-slider"}
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(Number(zoom))}
                classes={{ root: "slider" }}
              />
              <Button className="picture-button" variant={"contained"} color={"success"}
                startIcon={<CheckBoxIcon />} onClick={(e: any) => {
                  handleUpload(e)
                }}>MODIFIER</Button>

            </div>
          </>
          : null
      }
      <p>{session.user.name}</p>
      <p>{session.user.email}</p>
      <ul>
        <li>Prénom: {session.user.firstName ?? "N/A"}</li>
        <li>Nom de famille: {session.user.lastName ?? "N/A"}</li>
        <li>Email vérifié: {session.user.emailVerified ? "Oui" : "Non"}</li>
      </ul>
      <ProfileForm onChangePassword={changePasswordHandler} formError={formError} formSuccess={formSuccess} />
    </section>
  );
}

export default UserProfile;