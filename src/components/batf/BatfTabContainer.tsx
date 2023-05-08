import React from "react";
import Tabs from "./Tabs";
import Tab from "./Tab";

interface BaftTabContainerProps{
    onMinimizeClick?: () => void;
    onFullScreenClick?: () => void;
    selectedTab?: "events" | "anecdotes" | "chains";
}

export default class TabContainer extends React.Component<BaftTabContainerProps> {
    constructor(props: BaftTabContainerProps) {
        super(props);
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
                        {/* TODO INSERT EVENTS LIST HERE*/}
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