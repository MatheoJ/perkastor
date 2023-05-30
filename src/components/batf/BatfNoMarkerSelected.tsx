import { type NextPage } from "next";
import React from "react";

interface Props {
    name: string;
}

const BatfNoMarkerSelected: NextPage<Props> = ({name}) => {
    return (
         <div>
            <div className="fact">
                <div style={{textAlign:"center", justifyContent:"center", display:"flex", alignItems:"center", height:"100%", fontSize:"24px", color:"rgb(0,153,255)"}}>{name}</div>
                </div>
        </div>
    );
}

export default BatfNoMarkerSelected;