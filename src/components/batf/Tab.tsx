import { type NextPage } from 'next';
import React from 'react'

type Props = {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Tab: NextPage<Props> = ({ children, title, className }) => {
  return <div className={className}>{children}</div>
}

export default Tab;