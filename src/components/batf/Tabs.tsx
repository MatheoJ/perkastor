import React, { ReactElement, useState } from "react"

import TabTitle from "./TabTitle"

type Props = {
  children: ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)

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