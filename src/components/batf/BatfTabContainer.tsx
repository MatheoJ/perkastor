import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import { bool } from "aws-sdk/clients/signer";
import FactList from "../FactList";
import { Fact } from "@prisma/client";
import { selectSearchBarResultEvent } from "~/events/SelectSearchBarResultEvent";
import { selectHistoricalFigure } from "~/events/SelectSearchBarResultEvent";
import { selectEventFromSearchBar } from "~/events/SelectSearchBarResultEvent";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: number;
}

interface BatfTabContainerState{
    selectedTab: number;
    markerSelected: bool;
    facts: Fact[];
}

export default class TabContainer extends React.Component<BaftTabContainerProps, BatfTabContainerState> {
    markerSelected: boolean;

    constructor(props: BaftTabContainerProps) {
        super(props);
        this.state = {
            selectedTab: 0,
            markerSelected: false,
            facts : []
        };

        this.onMapChange();
        this.onSearchResultReceived();
    }

    onMapChange = () => {
        bus.subscribe(selectMapEvent, async event => {
            const geoInfos = event.payload;

            this.setState({
                markerSelected: true
            });

            console.log(this.state.markerSelected);
            //console.log(geoInfos);
            let response = await fetch(`/api/facts?locationId=${geoInfos.properties.id}`)
            response = await response.json();
            console.log(response);
            this.setState({
                facts: response[0].facts});
            /*if (response != undefined){
                console.log("ici");
                console.log(response);

                console.log()
                this.setState({
                    facts: response[0].facts,
                    markerSelected: true
                });
            }*/
        });
    }

    setFacts = (facts: Fact[]) => {
        this.setState({
            facts: facts,
            markerSelected: true
        });
    }

    onSearchResultReceived = () => {
        bus.subscribe(selectHistoricalFigure, event => {
          const handlePayload = async () => {
            const payload = await Promise.resolve(event.payload);
          };
          handlePayload().catch(error => {
            console.error("Error handling payload:", error);
          });
        });

        bus.subscribe(selectEventFromSearchBar, event => {
            const handlePayload = async () => {
              const payload = await Promise.resolve(event.payload);
              this.setFacts([payload]);
            };
            handlePayload().catch(error => {
              console.error("Error handling payload:", error);
            });
          });
      };

    selectedComponent(component: string){
        if(!this.state.markerSelected){
            return <BatfNoMarkerSelected/>
        }
        else{
            switch (component) {
                case "Évenements":
                    return <FactList facts={this.state.facts}/>;
                
                case "Anecdotes":
                    return <></>;
                
                case "Chaines":
                    return <></>;
            }
        }
    }

    render() {
        return (
            <>
                <div className={`batf-toolbar`}>
                    <button className="toggle" onClick={this.props.onFullScreenClick}>
                        <i className="fa fa-expand" style={{color:'#F1B706'}}></i>
                    </button>
                    <button className="toggle" onClick={this.props.onMinimizeClick}>
                        <i className="fa fa-minus" style={{color:'#F1B706'}}></i>
                    </button>
                </div>
                <Tabs>
                    <Tab title="Événements">
                        {this.selectedComponent("Évenements")}
                    </Tab>
                    <Tab title="Anecdotes">
                        {this.selectedComponent("Anecdotes")}
                    </Tab>
                    <Tab title="Chaines">
                        {this.selectedComponent("Chaines")}
                    </Tab>
                </Tabs>
            </>
        );
    }
}