import { Edit } from "@mui/icons-material";
import { Badge, IconButton, Avatar, Button, Slider } from "@mui/material";
import { NextPage } from "next";
import { forwardRef, useImperativeHandle, useState, useRef, useCallback, Dispatch, SetStateAction } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getCroppedImg, { stringAvatar } from './cropImage';
import axios from "axios";
import styles from './CropperView.module.css';

interface Props {
    apiRoute?: string,
    width?: number,
    height?: number,
    defaultFilename?: string,
    defaultFileType?: string,
    alt?: string,
    cropShape?: "rect" | "round",
    variant?: "circular" | "rounded" | "square",
    uploadOnSubmit: boolean,
    toUpdate: string,
    toUpdateId?: string,
    ref?: any,
    image?: string,
}

const CropperView: NextPage<Props> = forwardRef(({ apiRoute, defaultFilename, defaultFileType, alt, width, height, cropShape, variant, uploadOnSubmit, toUpdate, toUpdateId, image }, ref) => {
    useImperativeHandle(ref, () => ({
        async triggerUpload(toUpdateIdOverride: string) {
            return await handleUpload(
                uploadState,
                setUploadState,
                imageSrc,
                imageUrl,
                cropAreaPixels,
                handleSuccess,
                handleError,
                apiRoute || "/api/image",
                defaultFilename,
                defaultFileType,
                toUpdate,
                toUpdateIdOverride);
        }
    }));

    const [error, setError] = useState("")
    const [uploadState, setUploadState] = useState({});
    const profileImageRef = useRef<HTMLInputElement>(null)
    const [visible, setVisible] = useState<boolean>(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(image)
    const [imageSrc, setImageSrc] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(image)
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

    const handleSuccess = (url: string) => {
        setUploadState({ ...uploadState, success: true });
        setAvatarUrl(url)
        setImageSrc(undefined)
        setImageUrl("")
        setError("")
    }
    const handleError = (error: string) => {
        setUploadState({ ...uploadState, success: false });
        setError(error)
    }

    async function closeCropperAndPreviewImage() {
        let fileToUpload = await getCroppedImg(imageUrl, cropAreaPixels, 0, {
            horizontal: false,
            vertical: false
        }) as Blob

        // generate url from blob
        const previewImageUrl = URL.createObjectURL(fileToUpload)
        setVisible(false)

        setAvatarUrl(previewImageUrl)
        setError("")
    }

    // parameters:
    // e: mouseEvent
    // handleSuccess: function that takes a url (string) as parameter
    // handleError: function that takes a string as parameter
    // apiRoute: string
    // default filename: string
    // default filetype: string
    async function handleUpload(

        uploadState: {},
        setUploadState: Dispatch<SetStateAction<{}>>,
        imageSrc: File | null,
        imageUrl: string,
        cropAreaPixels: Area,
        handleSuccess: (url: string) => void,
        handleError: (error: string) => void,
        apiRoute: string,
        defaultFilename: string,
        defaultFileType: string,
        toUpdate: string,
        toUpdateId: string,
        e?: MouseEvent) {

        return new Promise(async (resolve, reject) => {

            e?.preventDefault()

            // async magic goes here...
            if (imageSrc === undefined) {
                handleError("Veuillez sélectionner une image.")
                reject("Veuillez sélectionner une image.")
            }

            let fileToUpload = await getCroppedImg(imageUrl, cropAreaPixels, 0, {
                horizontal: false,
                vertical: false
            }) as Blob

            const fileName = imageSrc.name || defaultFilename // "Photo de profil.png"
            const fileType = imageSrc.type || defaultFileType // "image/jpeg"

            // Patch the file information to the server to obtain a signed URL
            axios
                .patch(apiRoute, {
                    fileName: fileName,
                    fileType: fileType,
                    toUpdate: toUpdate,
                    toUpdateId: toUpdateId,
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
                            handleSuccess(url)
                            resolve(url)
                        })
                        .catch((_) => {
                            handleError("Nous n'avons pas pu téléverser votre image.")
                            reject("Nous n'avons pas pu téléverser votre image.")
                        });
                })
                .catch((error) => {
                    handleError("Nous n'avons pas pu téléverser votre image: " + (error?.message || error?.response?.data?.message || error))
                    reject("Nous n'avons pas pu téléverser votre image: " + (error?.message || error?.response?.data?.message || error))
                });
        }
        )
    }

    return (
        <div>
            <div>
                <input ref={profileImageRef} hidden accept="image/*" type="file" onChange={(event) => {
                    if (event.target.files) {
                        console.log(event.target.files[0])
                        setVisible(true)
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
                    {avatarUrl ? <Avatar alt={alt || "picture"} variant={variant || "circular"} src={avatarUrl} sx={{ width: width || 92, height: height || 92 }} /> :
                        <Avatar {...stringAvatar(alt || "picture")} variant={variant || "circular"} sx={{ width: width || 92, height: height || 92 }} />}
                </Badge>
                <div className={"error flex flex-center"}><p className={"error"}>{error}</p></div>
            </div>

            {
                (visible && imageSrc) ?
                    <>
                        <div className={styles.cropContainer}>
                            <div className={styles.innerCropContainer}>
                                <Cropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape={cropShape || "round"}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        </div>
                        <div className={styles.controls}>
                            <div className={styles.innerControls}>
                                <Button className={styles.pictureButton} variant={"contained"} color={"error"} sx={{ width: 250 }}
                                    startIcon={<CancelIcon />} onClick={() => {
                                        setImageSrc(undefined);
                                        setImageUrl("")
                                    }}>ANNULER</Button>
                                <Slider
                                    className={styles.zoomSlider}
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e, zoom) => setZoom(Number(zoom))}
                                    classes={{ root: "slider" }}
                                />
                                <Button className={styles.pictureButton} variant={"contained"} color={"success"} sx={{ width: 250 }}
                                    startIcon={<CheckBoxIcon />} onClick={(e: any) => {
                                        uploadOnSubmit ?
                                            handleUpload(
                                                uploadState,
                                                setUploadState,
                                                imageSrc,
                                                imageUrl,
                                                cropAreaPixels,
                                                handleSuccess,
                                                handleError,
                                                apiRoute || "/api/image",
                                                defaultFilename,
                                                defaultFileType,
                                                toUpdate,
                                                toUpdateId,
                                                e) : closeCropperAndPreviewImage();
                                    }}>MODIFIER</Button>
                            </div>
                        </div>
                    </>
                    : null
            }
        </div >
    )
})

export default CropperView;