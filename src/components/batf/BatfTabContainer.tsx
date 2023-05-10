import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import FactChainItem from "../FactChainItem";
import FactList from "../FactList";
import HistoricalFiguresView from "./HistoricalFiguresView";
import ChainList from "../ChainList";
import Chain from "../Chain";
import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";

import { useSession } from 'next-auth/react';
import { contributionClickEvent } from "~/events/ContributionClickEvent";
import { selectHistoricalFigureFromSearchBar, selectEventFromSearchBar } from '../../events/SelectSearchBarResultEvent';
import { HistoricalPerson } from "@prisma/client";
import Fact from "../Fact";
import FactChainContributions from "../FactChainContributions";
// selectedTab, setSelectedTab
const TabContainer = ({ onMinimizeClick, onFullScreenClick}) => {
  const [markerSelected, setMarkerSelected] = useState(false);
  const [facts, setFacts] = useState([]);
  const [editMod, setEditMod] = useState(false);
  const [chains, setChains] = useState([]);
  const [historicalFigure, setHistoricalFigure] = useState(null);
  const [historicalFigureId, setHistoricalFigureId] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const { data: session, status, update } = useSession({ required: false });
  const [itemSelected, setItemSelected] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleMapChange = bus.subscribe(selectMapEvent, event => {
    if (event.payload == null) {
      setMarkerSelected(false);
      setFacts([]);
      setChains([]);
    } else {
      const geoInfos = event.payload;
      setMarkerSelected(true);
      setLocationId(geoInfos.properties.id);
    }
  });

  const handleEditModChange = bus.subscribe(contributionClickEvent, event => {
    const newEditMod = !editMod;
    setEditMod(newEditMod)
  });

  const handleSelectHistoricalFigures = bus.subscribe(selectHistoricalFigureFromSearchBar, event => {
    const handlePayload = async () => {
      const payload = await Promise.resolve(event.payload);
      setHistoricalFigure(payload);

    };
    handlePayload().catch(error => {
      console.error("Error handling payload:", error);
    });
  });

  const handleSelectEvent = bus.subscribe(selectEventFromSearchBar, event => {
    const handlePayload = async () => {
      const payload = await Promise.resolve(event.payload);
      setFacts([payload]);
    };
    handlePayload().catch(error => {
      console.error("Error handling payload:", error);
    });
  });
  useEffect(() => {
    if (historicalFigure) {
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
    async function fetchData() {
      if (!editMod) {
        let response = await fetch(`/api/facts?locationId=${locationId}`);
        response = await response.json();
        console.log("response facts", response)
        let response2 = await fetch(`/api/chains?locationId=${locationId}`);
        response2 = await response2.json();
        console.log("response chains", response2)
        response.data ? setFacts(response.data) : setFacts([]);
        response2.data ? setChains(response2.data) : setChains([]);
      }
    }
    fetchData();
  }, [locationId]);

  useEffect(() => {
    async function fetchData() {
      if (!editMod) {
        setFacts([]);
        setChains([]);
        setItemSelected(null);
        setHistoricalFigure(null);
      }
      else {
        console.log("session", session)
        let userId = session?.user?.id;
        if (userId != null) {
          const promises = [fetch(`/api/facts?userId=${userId}`), fetch(`/api/chains?userId=${userId}`)];
          let [response, response2] = await Promise.all(promises);
          response = await response.json();
          response2 = await response2.json();
          response.data ? setFacts(response.data) : setFacts([]);
          response2.data ? setChains(response2.data) : setChains([]);
        }
      }
    }
    fetchData();
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
        else {
          return <FactList facts={facts} />;
        }
      case 1:
        return <HistoricalFiguresView historicalPerson={historicalFigure} />;

      case 2:
        if (editMod) {
          
          if(itemSelected == null){
            return <ChainListContributions chains={chains} />;
          }else{
            return <FactChainContributions chain={itemSelected} />;
          }
        }
        else {
          console.log("itemSelected", itemSelected)
          if(itemSelected == null){
            return <ChainList chains={chains} setItemSelected={setItemSelected} />;
          }else{
            return <Chain chain={itemSelected} setItemSelected={setItemSelected} />;
          }
        }
    }
  }

  return (
    <>
      <div className={`batf-toolbar`}>
        {editMod ? <div style={{ textAlign: "center" }}>Edition</div> : <div>Consultation</div>}
        <button className="toggle" onClick={onFullScreenClick}>
          <i className="fa fa-expand" style={{ color: '#F1B706' }}></i>
        </button>
        <button className="toggle" onClick={onMinimizeClick}>
          <i className="fa fa-minus" style={{ color: '#F1B706' }}></i>
        </button>
      </div>

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
    </>
  );
};

export default TabContainer;

