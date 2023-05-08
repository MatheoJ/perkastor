import React from 'react'

type Props = {
  children: React.ReactNode;
  title: string;
}

const Tab: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>
}

export default Tab;