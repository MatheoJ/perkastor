import { useEffect, useRef } from "react";

export const useFocus = (searchBarResultVisibility?: React.Dispatch<React.SetStateAction<boolean>>) => {
    const ref = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, []);
  
    const handleClick = () => {
      if (ref.current) {
        ref.current.focus();
        if (searchBarResultVisibility) {
            searchBarResultVisibility(true);
        }
      }
    };
  
    return { ref, handleClick };
  };