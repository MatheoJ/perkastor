import React, {useState} from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";

import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: number;
}

export default class TabContainer extends React.Component<BaftTabContainerProps> {
    markerSelected: boolean;

    constructor(props: BaftTabContainerProps) {
        super(props);
        this.markerSelected = false;

        bus.subscribe(selectMapEvent, event => {
            const { lat, lng } = event.payload; // Event is typed
            
            this.markerSelected = true;

            console.log("ici : " + event.toString());
        });
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
                        test
                    </Tab>
                    <Tab title="Anecdotes">
                        {/* TODO INSERT ANECDOTES LIST HERE*/}
                    </Tab>
                    <Tab title="Chaines">
                        {/* TODO INSERT CHAINS LIST HERE*/}
                    </Tab>
                </Tabs>
            </>
        );
    }
}