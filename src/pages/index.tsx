import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div>
          <h1> Perkastor </h1> 
          <b> À qui s’adresse-t-on ? </b>
          <p> Aux fans de l’histoire et à ceux qui souhaitent la découvrir !Tout le monde a déjà entendu une anecdote historique folle sur sa ville, difficile à trouver dans les sources officielles souvent très exhaustives. À Perkastor, on regroupe ces anecdotes rien que pour vous 😊 </p>
          <b> Comment contribuer ? </b>
          <p> Ce site est collaboratif, n’hésitez pas à rajouter vos propres anecdotes historiques. </p>
          <p> Le projet Perkastor étant open source, on vous invite à participer activement à son développement en vous rendant sur notre Github. </p>
          <div>
            <Link href="/mapWrapper">Explorer la carte</Link>
          </div>        
        </div>
      </main>
    </>
  );
};

export default Home;


