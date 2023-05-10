import { NextPage } from 'next';
import Link from 'next/link'
import React from "react";

interface Props {
  children: React.ReactNode;
  href: string;
}

const CustomLink: NextPage<Props> = ({
    children,
    href,
  }) => {
  return (
    <div className={"link-btn button-text"}>
       <Link href={href} passHref legacyBehavior>
        {children}
      </Link>
    </div>
  );
}

export default CustomLink;