import React from "react"

type Props = {
  title: string
  index: number;
  setSelectedTab: (index: number) => void;
  selectedTab: number;
  className?: string;
}

export default class TabTitle extends React.Component<Props> {

  constructor(props: Props){
    super(props);

  }

  classAssigner(){
    if (this.props.selectedTab == this.props.index){
      return 'batf-selectedtab';
    }

    return '';
  }

  render() {
    return (<li className={`batf-tab ${this.classAssigner()}`}>
      <button onClick={()=>this.props.setSelectedTab(this.props.index)}>{this.props.title}</button>  
    </li>)
  }
}