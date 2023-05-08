import React from "react"

type Props = {
  title: string
  selectedTab: string,
  onClick?: () => void;
}

const TabTitle: React.FC<Props> = ({ title, selectedTab, onClick }) => {

  return (
    <li className={`batf-tab ${selectedTab === title ? 'batf-selectedtab' : ''}`}>
      <button onClick={onClick}>{title}</button>  
    </li>
  )
}

export default TabTitle