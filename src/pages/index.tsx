import { useEffect, useState } from 'react';
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import Button from "~/components/buttons/Button";
import CustomLink from "~/components/links/CustomLink";
import styles from '../styles/Home.module.css';
import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const imagesDir = path.join(process.cwd(), '/public/images_home');
  console.log(imagesDir);
  const filenames = fs.readdirSync(imagesDir);
  console.log(filenames);
  const images = filenames.map(filename => {
    return {
      src: `/images_home/${filename}`,
    };
  });

  return {
    props: {
      images,
    },
  };
}

const Home: NextPage<{ images: { src: string }[] }> = ({ images }) => {
  console.log(images);
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [backgroundImage, setBackgroundImage] = useState(images[0].src);

  useEffect(() => {

    const imageSources = images.map(image => image.src);
    console.log("---------------------");
    console.log(imageSources);
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % imageSources.length; // Loop over images
      setBackgroundImage(imageSources[index]);
    }, 5000); // Change image every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up on unmount
    };
  }, []);


  return (
    <>
      <main className={styles.main}>
        <div className={styles.bgImage} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}></div>
        <div className={styles.bgText}>
        <h1>Perkastor</h1>
        <b>À qui s’adresse-t-on ?</b>
        <p>Aux fans de l’histoire et à ceux qui souhaitent la découvrir ! Tout le monde a déjà entendu une anecdote historique folle sur sa ville, difficile à trouver dans les sources officielles souvent très exhaustives. À Perkastor, on regroupe ces anecdotes rien que pour vous 😊</p>
        <b>Comment contribuer ?</b>
        <p>Ce site est collaboratif, n’hésitez pas à rajouter vos propres anecdotes historiques.</p>
        <p>Le projet Perkastor étant open source, on vous invite à participer activement à son développement en vous rendant sur notre Github.</p>
        <div>
          <Link legacyBehavior href="/mapWrapper">
            <a className={styles.link}>Explorer la carte</a>
          </Link>
        </div>
      </div>

      </main>

    </>
  );
};

export default Home;
