import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactChainContributions from "../FactChainContributions";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import FactList from "../FactList";
import { Fact, HistoricalPerson } from "@prisma/client";
import { useSession } from 'next-auth/react';
import HistoricalFigureView from "./HistoricalFiguresView";
import { contributionClickEvent } from "~/events/ContributionClickEvent";
import { set } from "react-hook-form";

const TabContainer = ({ onMinimizeClick, onFullScreenClick, selectedTab = 0 }) => {
    
    const [markerSelected, setMarkerSelected] = useState(false);
    const [facts, setFacts] = useState([]);
    const [editMod, setEditMod] = useState(false);
    const [chains, setChains] = useState([]);
    const [historicalFigure, setHistoricalFigure] = useState(null);
    const [historicalFigureId, setHistoricalFigureId] = useState(null);
    const [locationId, setLocationId] = useState(null);
    const {data : session, status, update} = useSession({required: false});
    const handleMapChange = bus.subscribe(selectMapEvent, event => {
        const geoInfos = event.payload;
        if(geoInfos == null){
          setMarkerSelected(false);
        }else{
          setMarkerSelected(true);
          setLocationId(geoInfos.properties.id);
        }
    });
    const handleEditModChange = bus.subscribe(contributionClickEvent, event => {
        const newEditMod = !editMod;
        setEditMod(newEditMod)
    });
    const handleHistoricalFigureChange = bus.subscribe("historicalFigure", async event => {
      const historicalFigureId = event.payload;
      setHistoricalFigure(historicalFigureId);
    });

    useEffect(() => {
      if(!markerSelected){
        setFacts([]);
        setChains([]);
        setHistoricalFigure(null);
      }
    }, [markerSelected]);
    useEffect(() => {
      async function fetchData() {
        if(!editMod){
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
        if(!editMod){
            setFacts([]);
            setChains([]);
            setHistoricalFigure(null);
        }
        else{
          console.log("session", session)
          let userId = session?.user?.id;
          if(userId != null){
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


  
      const selectedComponent = (component) => {
          switch (component) {
              case "Évenements":
                if (editMod){
                  return <FactListContributions facts={facts} setFacts={setFacts}/>;
                }
                else{
                  return <FactList facts={facts}/>;
                }
              case "Personnage Historique":                    
                  return <HistoricalFigureView historicalPerson={historicalFigure}/>;
              
              case "Chaines":
                if(editMod){
                  return <ChainListContributions chains={chains}/>;
                }
                else{
                  return <ChainListContributions chains={chains}/>;
                 // return <ChainList chains={chains}/>;
                }
          }
      }
  
      return (
        <>
            <div className={`batf-toolbar`}>
            {editMod? <div style={{textAlign:"center"}}>Edition</div> : <div>Consultation</div>}
                <button className="toggle" onClick={onFullScreenClick}>
                    <i className="fa fa-expand" style={{color:'#F1B706'}}></i>
                </button>
                <button className="toggle" onClick={onMinimizeClick}>
                    <i className="fa fa-minus" style={{color:'#F1B706'}}></i>
                </button>
            </div>
            
            <Tabs key={editMod ? 'edit' : 'view'}>
            
                <Tab title="Événements">
                    {selectedComponent("Évenements")}
                </Tab>
                <Tab title="Personnage Historique">
                    {selectedComponent("Personnage Historique")}
                </Tab>
                <Tab title="Chaines">
                    {selectedComponent("Chaines")}
                </Tab>
            </Tabs>
        </>
    );
  }
  
  export default TabContainer;
  
