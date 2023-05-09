import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import BatfNoMarkerSelected from "./BatfNoMarkerSelected";
import { bool } from "aws-sdk/clients/signer";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: number;
}

interface BatfTabContainerState{
    selectedTab: number;
    markerSelected: bool;
}

export default class TabContainer extends React.Component<BaftTabContainerProps, BatfTabContainerState> {
    markerSelected: boolean;

    constructor(props: BaftTabContainerProps) {
        super(props);
        
        this.state = {
            selectedTab: 0,
            markerSelected: false
        }

        bus.subscribe(selectMapEvent, event => {
            const { lat, lng } = event.payload;
            
            this.setState({
                markerSelected: true
            });
        });
    }

    selectedComponent(component: string){
        if(!this.state.markerSelected){
            return <BatfNoMarkerSelected/>
        }
        else{
            switch (component) {
                case "Évenements":
                    return <></>;
                
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