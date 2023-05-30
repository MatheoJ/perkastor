import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { type NextPage } from "next";
import { useState } from "react";

interface Props{
    key: React.Key,
    truncated: boolean;
    text: string;
    untruncatedText: string;
    category: string;
    onClick: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  }
  
  const SearchIem: NextPage<Props> = ({ key, truncated, text, untruncatedText, category, onClick }) => {
    const [extanded, setExtanded] = useState(false);
    return (
        <div className="dataItem">
          <span className="dataItem__name" onClick={onClick}
            data-category={category}>{extanded ? untruncatedText : text}</span>
            {/* show the rest of the resultTitle when clicking on the extend button*/}
            {truncated && <IconButton onClick={() => setExtanded(!extanded)}>
                {extanded ? <ArrowDownward fontSize={"small"} /> : <ArrowUpward fontSize={"small"} />}
            </IconButton>}
        </div>
    )
  };

  export default SearchIem;