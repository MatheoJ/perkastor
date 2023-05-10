import React from "react";
import BatfTabContainer from "./BatfTabContainer";

interface BatfProps {
  children: React.ReactNode
}

interface BatfState{
    state: "normal" | "fullscreen" | "minimized";
    selectedTab: "Événements" | "Anecdotes" | "Chaînes";
}

export default class Batf extends React.Component<BatfProps, BatfState> {
    constructor(props: BatfProps) {
        super(props);

        this.state = {
            state: "minimized",
            selectedTab: "Événements"
        };
    }

    maximize = () => {
        this.setState({
            state: this.state.state != "fullscreen" ? "fullscreen" : "normal"
        });
    }

    hide = ()=>  {
        this.setState({
            state: "minimized"
        });
    }

    show = ()=> {
        this.setState({
            state: "normal"
        });
    }

    classAssigner(){
        if (this.state.state != "minimized" && this.state.state != "fullscreen"){
            return '';
        }

        return 'batf-' + this.state.state;
    }

    render() {
        const { children } = this.props;
        const { state } = this.state;

        return (
            <div className={`batf ${this.classAssigner()}`}>
                {
                    (() => {
                        if (state !== "minimized"){
                            return <>
                                <BatfTabContainer onFullScreenClick={this.maximize} onMinimizeClick={this.hide}></BatfTabContainer>
                            </>;
                        }
                        else{
                            return <button className="toggle batf-minimized-btn" onClick={this.show}>
                                <i className="fa fa-bars"></i>
                            </button>;
                        }
                    })()
                }
                {children}
            </div>
        );
    }
}