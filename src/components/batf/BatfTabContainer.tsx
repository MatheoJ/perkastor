import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactChainContributions from "../FactChainContributions";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import {Chain} from "../../types/Chain";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import { bool } from "aws-sdk/clients/signer";
import FactList from "../FactList";
import { Fact } from "@prisma/client";
import HistoricalFigure from "./HistoricalFigures";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: number;
}

interface BatfTabContainerState{
    selectedTab: number;
    markerSelected: bool;
    facts: Fact[];
    editMod: bool;
    chains: Chain[];
}

export default class TabContainer extends React.Component<BaftTabContainerProps, BatfTabContainerState> {
    markerSelected: boolean;

    constructor(props: BaftTabContainerProps) {
        super(props);
        this.state = {
            selectedTab: 0,
            markerSelected: false,
            facts : [],
            editMod : true,
        };
        this.onMapChange();
        this.onChangeEditMod();
    }
    onChangeEditMod = () => {
        bus.subscribe("editMod", async event => {
            const editMod = event.payload;
            this.setState({
                editMod: editMod
            });
        });
    }

    onMapChange = () => {
        bus.subscribe(selectMapEvent, async event => {
            const geoInfos = event.payload;

           // console.log(event.payload.toString());
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
    selectedComponent(component: string){

        /*if(!this.state.markerSelected){
            return <BatfNoMarkerSelected/>
        }
        else{*/
            switch (component) {
                case "Évenements":
                  if (this.state.editMod){
                    return <FactListContributions facts={this.state.facts}/>;
                  }
                  else{
                    return <FactList facts={this.state.facts}/>;
                  }
                
                case "Personnage Historique":                    
                    return <HistoricalFigure/>;
                
                case "Chaines":
                  if(this.state.editMod){
                    return <ChainListContributions chains={this.state.chains}/>;
                  }
                  else{
                    return <ChainList chains={this.state.chains}/>;
                  }
            }
       // }
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
                    <Tab title="P">
                        {this.selectedComponent("Personnage Historique")}
                    </Tab>
                    <Tab title="Chaines">
                        {this.selectedComponent("Chaines")}
                    </Tab>
                </Tabs>
            </>
        );
    }
}