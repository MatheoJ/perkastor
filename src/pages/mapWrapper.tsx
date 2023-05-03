import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Map from "../components/Map";
import SideBar from "../components/SideBar";

import { api } from "~/utils/api";

const mapWrapper: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      
      <Map />
      <SideBar/>
        
    </>
  );
};

export default mapWrapper;


