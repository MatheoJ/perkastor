import { useEffect, useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import Button from '@mui/material/Button';
import styles from '../styles/Home.module.css';
import fs from 'fs';
import path from 'path';
import { Map } from '@mui/icons-material';
import { Box } from '@mui/material';
import images from '../../public/images_home.json'

type ImageInfo = {
  name: string,
  author: string,
  url: string,
  filename: string
  src: string | null
}

const Home: NextPage<{}> = () => {

  const [backgroundImage, setBackgroundImage] = useState(`/images_home/${images[0].filename}`);
  const [imageUrl, setImageUrl] = useState(images[0].url);
  const [imageAuthor, setImageAuthor] = useState(images[0].author);
  const [imageName, setImageName] = useState(images[0].name);

  useEffect(() => {

    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % images.length; // Loop over images
      setBackgroundImage(`/images_home/${images[index].filename}`);
      setImageAuthor(images[index].author);
      setImageUrl(images[index].url);
      setImageName(images[index].name);
    }, 5000); // Change image every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up on unmount
    };
  }, []);


  return (
    <>
      <main className={styles.main}>
        <div className={styles.banner} style={backgroundImage ? { backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(${backgroundImage})` } : {}}>
          <h1 className={styles.headline}>Perkastor</h1>
          <h2 className={styles.subtitle}>Découvrez la petite histoire dans la grande</h2>
          <div className={styles.imageInfo}>
            <p>Image par <Link href={imageUrl} target="_blank" rel="noopener noreferrer">{imageAuthor}</Link> sur <Link href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">Unsplash</Link></p>
          </div>
        </div>
        <div className={styles.content}>
          <Link legacyBehavior href="/mapWrapper">
            <Box textAlign='center' className='box margin-m'>
              <Button variant={"outlined"} color={"primary"} startIcon={<Map />}>Explorer la carte</Button>
            </Box>
          </Link>
          <h4>À qui s’adresse-t-on ?</h4>
          <p>Aux fans de l’histoire et à ceux qui souhaitent la découvrir ! Tout le monde a déjà entendu une anecdote historique folle sur sa ville, difficile à trouver dans les sources officielles souvent très exhaustives. Chez Perkastor, on regroupe ces anecdotes avec vous et pour vous 😊</p>
          <br />
          <h4>Comment contribuer ?</h4>
          <p>Ce site est collaboratif, n’hésitez pas à rajouter vos propres anecdotes historiques.</p>
          <p>Le projet Perkastor étant open source, on vous invite à participer activement à son développement en vous rendant sur notre Github.</p>

          {/* <div className={styles.blobsContainer}>
            <div className={styles.blob1} />
            <div className={styles.bgImage} />
            <Link legacyBehavior href="/mapWrapper">
              <h3>Explorer la carte</h3>
            </Link>
          </div> */}
        </div>

      </main>

    </>
  );
};

export default Home;
