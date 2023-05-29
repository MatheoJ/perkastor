import { NextPage } from "next"
import React, { ReactElement, useState } from "react"
import RingLoader from "react-spinners/RingLoader";

import TabTitle from "./TabTitle"

type Props = {
  children: ReactElement[],
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Tabs: NextPage<Props> = ({ children, selectedTab, setSelectedTab, isLoading, setIsLoading }) => {
  
  function handleTabChange(tab: number){
    setSelectedTab(tab);
  }

  return (
    <div style={{flexGrow: 1}}>
      <ul className="tabs-row" style={{cursor:"pointer"}}>    
        {children.map((item, index) => (
          <TabTitle
            key={index}
            title={item.props.title}
            index={index}
            setSelectedTab={handleTabChange}
            selectedTab={selectedTab}
          />
        ))}
      </ul>
      <div className="batf-content">
      {isLoading ? <div className="loadingTabs" ><RingLoader size={100} color="white" /></div> : children[selectedTab]}
      </div>
    </div>
  )
}

export default Tabs;