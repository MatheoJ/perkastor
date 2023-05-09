import React from "react"

type Props = {
  title: string
  index: number;
  setSelectedTab: (index: number) => void;
  className: string;
  selectedTab: number;
}

interface TabTitleState{
  selectedTab: number;
}

export default class TabTitle extends React.Component<Props, TabTitleState> {

  constructor(props: Props){
    super(props);

    this.state = {
      selectedTab: 0
    }
  }

  classAssigner(){
    if (this.state.selectedTab == this.props.index){
      return 'batf-selectedtab';
    }

    return '';
  }

  render() {
    return (<li className={`batf-tab ${this.classAssigner()}`}>
      <button onClick={() => {
        this.setState({selectedTab: this.props.index})
      }}>{this.props.title}</button>  
    </li>)
  }
}