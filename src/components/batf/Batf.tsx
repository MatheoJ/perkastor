import React, { useState, useEffect, use } from "react";
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
    useEffect(() => {
        const handleMapChange = bus.subscribe(selectMapEvent, event => {
            if (event.payload != null) {
                setState("normal");
                //setSelectedTab("Événements");
            }
        });
        return () => {
            handleMapChange();
        }
    }, []);


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

    return (
        <div className={`batf ${classAssigner()}`}>
            <div className={`inner-batf`}>
                <BatfTabContainer
                    onFullScreenClick={maximize}
                    onMinimizeClick={hide}
                    setBatfState={setState}
                    batfState={state}
                />
                {children}
            </div>
            {state === "minimized" && (
                <button className="toggle batf-minimized-btn" onClick={show}>
                    <i className="fa fa-bars"></i>
                </button>
            )}
        </div>
    );
    /*
    return (
            <div className={`batf ${classAssigner()}`}>
            {
                (() => {
                    if (state !== "minimized") {
                        //selectedTab={selectedTab} setSelectedTab={setSelectedTab}
                        return <>
                            <BatfTabContainer onFullScreenClick={maximize} onMinimizeClick={hide}></BatfTabContainer>
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
    */

}

export default Batf;
