import { type NextPage } from "next";
import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import FactList from "../components/FactList";

import { api } from "~/utils/api";
import Card from "~/components/Card";

const mapWrapper: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const cards = [
    { id: 1, title: 'Card 1', description: 'Description for card 1' },
    { id: 2, title: 'Card 2', description: 'Description for card 2' },
    { id: 3, title: 'Card 3', description: 'Description for card 3' },
    { id: 4, title: 'Card 4', description: 'Description for card 4' },
    { id: 5, title: 'Card 5', description: 'Description for card 5' },
    { id: 6, title: 'Card 6', description: 'Description for card 6' },
    { id: 7, title: 'Card 7', description: 'Description for card 7' },
    { id: 8, title: 'Card 8', description: 'Description for card 8' },
    { id: 9, title: 'Card 9', description: 'Description for card 9' },
    { id: 10, title: 'Card 10', description: 'Description for card 10' },
    { id: 11, title: 'Card 11', description: 'Description for card 11' },
    { id: 12, title: 'Card 12', description: 'Description for card 12' },
    { id: 13, title: 'Card 13', description: 'Description for card 13' },
    { id: 14, title: 'Card 14', description: 'Description for card 14' },
    { id: 15, title: 'Card 15', description: 'Description for card 15' },
    { id: 16, title: 'Card 16', description: 'Description for card 16' },
    { id: 17, title: 'Card 17', description: 'Description for card 17' },
    { id: 18, title: 'Card 18', description: 'Description for card 18' },
    { id: 19, title: 'Card 19', description: 'Description for card 19' },
    { id: 20, title: 'Card 20', description: 'Description for card 20' },
  ];
  

  return (
    <> {/* TODO: Insert a flex parent component that divides the width in half */}
      <Map />
      {/* TODO: Insert the BATF here */}
      <div>
        <Card title={hello.data} description="Description for card 1" />
      </div>
    </>
  );
};

export default mapWrapper;


