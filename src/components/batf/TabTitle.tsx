import React from "react"

type Props = {
  title: string
  index: number;
  setSelectedTab: (index: number) => void;
  selectedTab: number;
}

const TabTitle: React.FC<Props> = ({ title, index, setSelectedTab, selectedTab }) => {
  const classAssigner = () => {
    if (selectedTab === index){
      return 'batf-selectedtab';
    }
    return '';
  }

  return (
    <li onClick={() => setSelectedTab(index)} className={`batf-tab ${classAssigner()}`}>
      {title}
    </li>
  );
}

export default TabTitle;