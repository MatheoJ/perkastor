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
import { set } from "zod";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";

// selectedTab, setSelectedTab
const TabContainer = ({ onMinimizeClick, onFullScreenClick, setBatfState, batfState }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [lastSlide, setLastSlide] = useState(0);
  const [changedChain, setChangedChain] = useState(null);
  let lastTimeMapChanged = 0;


  useEffect(() => {
    const unsubMap = bus.subscribe(selectMapEvent, event => {
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

    const unsubClick = bus.subscribe(contributionClickEvent, event => {
      setBatfState(previous => previous == "minimized" ? "normal" : previous);
      setEditMod(previous => !previous);
    });
    const unsubHistFigure = bus.subscribe(selectHistoricalFigureFromSearchBar, event => {
      //const payload = await Promise.resolve(event.payload);
      setHistoricalFigure(null);
      setHistoricalFigure(event.payload);
    });

    const unsubEventFrom = bus.subscribe(selectEventFromSearchBar, event => {
      //const payload = await Promise.resolve(event.payload);
      if (batfState == "minimized") {
        setBatfState("normal");
      }
      setSelectedTab(0);
      setFacts([event.payload]);
    });
    return () => {
      unsubClick();
      unsubMap();
      unsubHistFigure();
      unsubEventFrom();
    };
  }, []);

  async function fetchLocationData() {
    setIsLoading(true);
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
        setFacts([]);
        setChains([]);
      }
    }
    setSelectedTab(0)
    setIsLoading(false);
  }

  async function fetchUserFacts() {
    if (editMod) {
      setIsLoading(true);
      let userId = session?.user?.id;
      if (userId != null) {
        const promises = [fetch(`/api/facts?userId=${userId}`), fetch(`/api/chains?userId=${userId}`)];
        const [response, response2] = await Promise.all(promises);
        const jsonPromises = [response.json(), response2.json()];
        const [responseJson, response2Json] = await Promise.all(jsonPromises);
        responseJson.data ? setFacts(responseJson.data) : setFacts([]);
        response2Json.data ? setChains(response2Json.data) : setChains([]);
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log('loading: ' + isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (historicalFigure != null) {
      if (batfState == "minimized") {
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

  useEffect(() => {
    // change the chain array at the index of the changed chain
    if (changedChain != null) {
      let newChains = [...chains];
      newChains[chains.findIndex(chain => chain.id === changedChain.id)] = changedChain;
      setChains(newChains);
    }
  }, [changedChain]);

  const selectedComponent = () => {
    switch (selectedTab) {
      case 0:
        if (editMod) {
          if(facts.length == 0){
            return <BatfNoMarkerSelected/>;
          }
          return <FactListContributions facts={facts} setFacts={setFacts} />;
        }
        if(facts.length == 0){
          return <BatfNoMarkerSelected/>;
        }
        return <FactList facts={facts} lastSlide={lastSlide} setLastSlide={setLastSlide} />;
      case 1:
        return <HistoricalFiguresView historicalPerson={historicalFigure} />;
      case 2:
        if (editMod) {
          if (itemSelected === null) {
            if(chains.length == 0){
              return <BatfNoMarkerSelected/>;
            }
            return <ChainListContributions chains={chains} setItemSelected={setItemSelected} setChains={setChains} />;
          }
          if(itemSelected === null){
            return <BatfNoMarkerSelected/>;
          }
          return <FactChainContributions chain={itemSelected} setItemSelected={setItemSelected} setChangedChain={setChangedChain} />;
        }
        else {
          if (itemSelected === null) {
            if(chains.length == 0){
              return <BatfNoMarkerSelected/>;
            }
            return <ChainList chains={chains} setItemSelected={setItemSelected} />;
          }
          if(itemSelected === null){
            return <BatfNoMarkerSelected/>;
          }
          return <Chain chain={itemSelected} setItemSelected={setItemSelected} />;
        }
    }
  }

  return (
    <>
      <div className={`batf-toolbar`}>
        <Avatar sx={{ width: 24, height: 24, color: '#344453', backgroundColor: '#F1B706' }} onClick={onFullScreenClick}>
          <Fullscreen />
        </Avatar>
        <Avatar sx={{ width: 24, height: 24, color: '#344453', backgroundColor: '#F1B706' }} onClick={onMinimizeClick}>
          <Remove />
        </Avatar>
      </div>

      <div className="tabs-container">
        {editMod ? <h2 style={{ textAlign: "center" }}>Edition</h2> : <h2>Consultation</h2>}
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} isLoading={isLoading} setIsLoading={setIsLoading} key={editMod ? 'edit' : 'view'}>
          <Tab className={"tab-content"} title="Événements">
            {selectedTab === 0 && selectedComponent()}
          </Tab>
          <Tab className={"tab-content"} title="Personnage Historique">
            {selectedTab === 1 && selectedComponent()}
          </Tab>
          <Tab className={"tab-content"} title="Chaines">
            {selectedTab === 2 && selectedComponent()}
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default TabContainer;

