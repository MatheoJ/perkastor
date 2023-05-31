import { ArrowDownward, ArrowUpward, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import { type NextPage } from "next";
import { useState } from "react";

interface Props{
    truncated: boolean;
    text: string;
    untruncatedText: string;
    category: string;
    onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  }
  
  const SearchIem: NextPage<Props> = ({ truncated, text, untruncatedText, category, onClick }) => {
    const [extanded, setExtanded] = useState(false);
    return (
        <div className="dataItem">
          <span className="dataItem__name" onClick={onClick}
            data-category={category}>{extanded ? untruncatedText : text}</span>
            {/* show the rest of the resultTitle when clicking on the extend button*/}
            {truncated && <Avatar onClick={() => setExtanded(!extanded)} className="right-icon" sx={{ width: 16, height: 16, color: '#333', backgroundColor: '#fff' }}>
                {extanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </Avatar>}
        </div>
    )
  };

  export default SearchIem;