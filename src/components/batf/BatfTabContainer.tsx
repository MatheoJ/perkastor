import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";
import FactChainContributions from "../FactChainContributions";
import FactListContributions from "../FactListContributions";
import ChainListContributions from "../ChainListContributions";
import FactChainItem from "../FactChainItem";
import ChainList from "../ChainList";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import { bool } from "aws-sdk/clients/signer";
import FactList from "../FactList";
import { Fact, Chain } from "@prisma/client";

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
                    return <></>;
                
                case "Anecdotes":
                    return <></>;
                
                case "Chaines":
                    return <></>;
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