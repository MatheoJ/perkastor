import React, { useState, useEffect } from "react";
import BatfTabContainer from "./BatfTabContainer";
import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import { NextPage } from "next";

interface BatfProps {
    children: React.ReactNode
}

const Batf: NextPage<BatfProps> = ({ children }) => {
    const [state, setState] = useState<"normal" | "fullscreen" | "minimized">("minimized");
    //const [selectedTab, setSelectedTab] = useState<"Événements" | "Anecdotes" | "Chaînes">("Événements");

    const handleMapChange = bus.subscribe(selectMapEvent, event => {
        if (event.payload != null) {
            setState("normal");
            //setSelectedTab("Événements");
        }
    });


    const maximize = () => {
        setState(currentState => currentState !== "fullscreen" ? "fullscreen" : "normal");
    }

    const hide = () => {
        setState("minimized");
    }

    const show = () => {
        setState("normal");
    }

    const classAssigner = () => {
        if (state !== "minimized" && state !== "fullscreen") {
            return '';
        }

        return 'batf-' + state;
    }
    /*
    return (
        <div className={`batf ${classAssigner()}`}>
            <div className={'inner-batf'}>
                <BatfTabContainer 
                    style={{ display: state === "minimized" ? "none" : "block" }} 
                    onFullScreenClick={maximize} 
                    onMinimizeClick={hide} 
                    setBatfState={setState} 
                    batfSate={state}
                />
                {state === "minimized" && (
                    <button className="toggle batf-minimized-btn" onClick={show}>
                        <i className="fa fa-bars"></i>
                    </button>
                )}
                {children}
            </div>
        </div>
    );
    */
    return (
            <div className={`batf ${classAssigner()}`}>
            {
                (() => {
                    if (state !== "minimized") {
                        //selectedTab={selectedTab} setSelectedTab={setSelectedTab}
                        return <>
                            <BatfTabContainer onFullScreenClick={maximize} onMinimizeClick={hide} batfState={state} setBatfState={setState}></BatfTabContainer>
                        </>;
                    }
                    else {
                        return <button className="toggle batf-minimized-btn" onClick={show}>
                            <i className="fa fa-bars"></i>
                        </button>;
                    }
                })()
            }
            {children}
        </div>
    );
        
}

export default Batf;
