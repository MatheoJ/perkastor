import { type NextPage } from "next";
import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";

import { api } from "~/utils/api";

const mapWrapper: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <> {/* TODO: Insert a flex parent component that divides the width in half */}
      <Map />
      {/* TODO: Insert the BATF here */}
    </>
  );
};

export default mapWrapper;


