import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import FactList from "../FactList";
import HistoricalFiguresView from "./HistoricalFiguresView";
import ChainList from "../ChainList";
import Chain from "../Chain";
import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import { useSession } from 'next-auth/react';
import { contributionClickEvent } from "~/events/ContributionClickEvent";
import { selectHistoricalFigureFromSearchBar, selectEventFromSearchBar } from '../../events/SelectSearchBarResultEvent';
import FactChainContributions from "../FactChainContributions";
import { Avatar } from "@mui/material";
import { Fullscreen, Remove } from "@mui/icons-material";
// selectedTab, setSelectedTab
const TabContainer = ({ onMinimizeClick, onFullScreenClick, setBatfState, batfState}) => {
  const [markerSelected, setMarkerSelected] = useState(false);
  const [facts, setFacts] = useState([]);
  const [editMod, setEditMod] = useState(false);
  const [chains, setChains] = useState([]);
  const [historicalFigure, setHistoricalFigure] = useState(null);
  const [historicalFigureId, setHistoricalFigureId] = useState(null);
  const [locationId, setLocationId] = useState<String>(null);
  const { data: session, status, update } = useSession({ required: false });
  const [itemSelected, setItemSelected] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  let lastTimeMapChanged = 0;
  bus.subscribe(selectMapEvent, event => {
    let now = new Date().getTime();
    if (now - lastTimeMapChanged < 1000) {
      if (event.payload == null) {
        setMarkerSelected(false);
        setFacts([]);
        setChains([]);
      } else {
        const geoInfos = event.payload;
        setMarkerSelected(true);
        setLocationId(geoInfos.properties.id);
      }
    } else {
      lastTimeMapChanged = now;
    }
  });
  bus.subscribe(contributionClickEvent, event => {
    const newEditMod = !editMod;
    setEditMod(newEditMod)
  });
  bus.subscribe(selectHistoricalFigureFromSearchBar, event => {
    const handlePayload =  () => {
      //const payload = await Promise.resolve(event.payload);
      setHistoricalFigure(event.payload);
    };
    handlePayload();
  });

  bus.subscribe(selectEventFromSearchBar, event => {
    const handlePayload = () => {
      //const payload = await Promise.resolve(event.payload);
      if(batfState == "minimized"){
        setBatfState("normal");
      }
      setSelectedTab(0);
      setFacts([event.payload]);
    };
    handlePayload();
  });

  async function fetchLocationData() {
    if (!editMod) {
      if (locationId) {
        const promises = [fetch(`/api/facts?locationId=${locationId}`), fetch(`/api/chains?locationId=${locationId}`)];
        const [response, response2] = await Promise.all(promises);
        const jsonPromises = [response.json(), response2.json()];
        const [responseJson, response2Json] = await Promise.all(jsonPromises);
        responseJson.data ? setFacts(responseJson.data) : setFacts([]);
        response2Json.data ? setChains(response2Json.data) : setChains([]);
      }
      else {
        console.error("No locationId")
      }
    }
    setSelectedTab(0)
  }

  async function fetchUserFacts() {
    if (!editMod) {
      setFacts([]);
      setChains([]);
      setItemSelected(null);
      setHistoricalFigure(null);
    }
    else {
      let userId = session?.user?.id;
      if (userId != null) {
        const promises = [fetch(`/api/facts?userId=${userId}`), fetch(`/api/chains?userId=${userId}`)];
        const [response, response2] = await Promise.all(promises);
        const jsonPromises = [response.json(), response2.json()];
        const [responseJson, response2Json] = await Promise.all(jsonPromises);
        responseJson.data ? setFacts(responseJson.data) : setFacts([]);
        response2Json.data ? setChains(response2Json.data) : setChains([]);
      }
    }
  }

  useEffect(() => {
    if (historicalFigure != null) {
      if(batfState == "minimized"){
         setBatfState("normal")
      }
      setSelectedTab(1);
    }
  }, [historicalFigure]);

  useEffect(() => {
    if (!markerSelected) {
      setFacts([]);
      setChains([]);
      setItemSelected(null);
      setHistoricalFigure(null);
    }
  }, [markerSelected]);

  useEffect(() => {
    fetchLocationData();
  }, [locationId]);

  useEffect(() => {
    fetchUserFacts();
  }, [editMod]);

  useEffect(() => {
    async function fetchData() {
      if (historicalFigureId != null) {
        let response = await fetch(`/api/historical-figures?id=${historicalFigureId}`);
        response = await response.json();
        setHistoricalFigure(response[0]);
      }
    }
    fetchData();
  }, [historicalFigureId]);

  const selectedComponent = () => {
    switch (selectedTab) {
      case 0:
        if (editMod) {
          return <FactListContributions facts={facts} setFacts={setFacts} />;
        }
        return <FactList facts={facts} />;
      case 1:
        return <HistoricalFiguresView historicalPerson={historicalFigure} />;
      case 2:
        if (editMod) {

          if (itemSelected === null) {
            return <ChainListContributions chains={chains} />;
          }
          return <FactChainContributions chain={itemSelected} />;
        }
        else {
          if (itemSelected === null) {
            return <ChainList chains={chains} setItemSelected={setItemSelected} />;
          }
          return <Chain chain={itemSelected} setItemSelected={setItemSelected} />;
        }
    }
  }

  return (
    <>
      <div className={`batf-toolbar`}>
        <Avatar sx={{ width: 24, height: 24, color: '#F1B706', backgroundColor: '#fff' }} onClick={onFullScreenClick}>
          <Fullscreen />
        </Avatar>
        <Avatar sx={{ width: 24, height: 24, color: '#F1B706', backgroundColor: '#fff' }} onClick={onMinimizeClick}>
          <Remove />
        </Avatar>
      </div>

      <div className="tabs-container">
        {editMod ? <h2 style={{ textAlign: "center" }}>Edition</h2> : <h2>Consultation</h2>}
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} key={editMod ? 'edit' : 'view'}>
          <Tab className={"tab-content"} title="Événements">
            {selectedComponent()}
          </Tab>
          <Tab className={"tab-content"} title="Personnage Historique">
            {selectedComponent()}
          </Tab>
          <Tab className={"tab-content"} title="Chaines">
            {selectedComponent()}
          </Tab>

        </Tabs>
      </div>
    </>
  );
};

export default TabContainer;

