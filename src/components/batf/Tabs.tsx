import React, { ReactElement, useState } from "react"

import TabTitle from "./TabTitle"

type Props = {
  children: ReactElement[]
}

const Tabs: React.FC<Props> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Événements")

  function handleTabChange(tab: string){
    setSelectedTab(tab);
  }

  return (
    <div style={{flexGrow: 1}}>
      <ul style={{display: "flex", justifyContent: 'space-around'}}>    
        {children.map((item, index) => (
          <TabTitle
            key={index}
            title={item.props.title}
            selectedTab={selectedTab}
            onClick={() => handleTabChange(item.props.title)}
          />
        ))}
      </ul>
      {children[selectedTab]}
    </div>
  )
}

export default Tabs;