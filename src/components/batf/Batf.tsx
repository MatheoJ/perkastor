import React from "react";
import Button from "../buttons/Button";

interface BatfProps {
  children: React.ReactNode
}

interface BatfState{
    state: "normal" | "fullscreen";
}

export default class Batf extends React.Component<BatfProps, BatfState> {
    constructor(props: BatfProps) {
        super(props);

        this.state = {
            state: "normal"
        };
    }

    setFullscreen = () => {
        this.setState({
            state: this.state.state === "normal" ? "fullscreen" : "normal"
        });
    }

    render() {
        const { children } = this.props;
        const { state } = this.state;

        return (
            <div className={`batf ${state === 'fullscreen' ? 'batf-fullscreen' : ''}`}>
                <Button onClick={this.setFullscreen}>Full screen</Button>
                {children}
            </div>
        );
    }
}