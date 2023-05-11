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
  src?: string
}

const Home: NextPage<{}> = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(`/images_home/${images[0].filename}`);
  const [imageUrl, setImageUrl] = useState(images[0].url);
  const [imageAuthor, setImageAuthor] = useState(images[0].author);
  const [imageName, setImageName] = useState(images[0].name);

  // Change of banner image every 5 seconds
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % images.length; // Loop over images
      setCurrentImageIndex(index);
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
        <div className={styles.banner}>
          <div className={styles.imageContainer}>
            {
              images.map((imageInfo: ImageInfo, index: number) => {
                return (
                  <div key={index}
                    className={`${styles.image} ${(index === currentImageIndex) ? styles.active : ''}`}
                    style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(/images_home/${imageInfo.filename})` }} />
                )
              })
            }
          </div>
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
          <p>Le projet Perkastor étant open source, on vous invite à participer activement à son développement en vous rendant sur notre <a href='https://github.com/MatheoJ/perkastor' target='_blank'>Github</a>.</p>
          <br/>
          <p><Link href="/privacyPolicy" target="_blank" rel="noopener noreferrer">Politique de confidentialité</Link><br/><Link href="/gcu" target="_blank" rel="noopener noreferrer">Conditions générales d'utilisation</Link></p>
        </div>

      </main>

    </>
  );
};

export default Home;
