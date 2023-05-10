import { NextPage } from "next"
import React, { ReactElement, useState } from "react"

import TabTitle from "./TabTitle"

type Props = {
  children: ReactElement[],
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
}

const Tabs: NextPage<Props> = ({ children, selectedTab, setSelectedTab }) => {
  
  function handleTabChange(tab: number){
    setSelectedTab(tab);
  }

  return (
    <div style={{flexGrow: 1}}>
      <ul style={{display: "flex", justifyContent: 'space-around'}}>    
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
         {children[selectedTab]}
      </div>
    </div>
  )
}

export default Tabs;