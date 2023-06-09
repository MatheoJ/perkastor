import React, { useState, useEffect, use } from "react";
import BatfTabContainer from "./BatfTabContainer";
import { bus } from "../../utils/bus";
import { selectMapEvent } from "~/events/map/SelectMapEvent";
import { type NextPage } from "next";
import MenuIcon from '@mui/icons-material/Menu';

interface BatfProps {
    children?: React.ReactNode
}

const Batf: NextPage<BatfProps> = ({ children }) => {
    const [state, setState] = useState<"normal" | "fullscreen" | "minimized">("minimized");
    
    useEffect(() => {
        const handleMapChange = bus.subscribe(selectMapEvent, event => {
            if (event.payload != null) {
                setState("normal");
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
            <div className={`batf-handle ${state !== "minimized" ? 'hidden' : 'visible'}`}>
                <button className="toggle batf-minimized-btn" onClick={show}>
                    <MenuIcon className="menu" style={{ color: "#F1B706", }} />
                </button>
            </div>
            <div className={'batf-body'}>
                <BatfTabContainer onFullScreenClick={maximize} onMinimizeClick={hide} batfState={state} setBatfState={setState} />
                {children}
            </div>
        </div>
    );
}

export default Batf;
