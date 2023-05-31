import { type NextPage } from "next";
import React from "react";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  hidden?: boolean;
}

const ButtonType = {
  "primary": "btn--primary",
  "secondary": "btn--secondary",
  "tertiary": "btn--tertiary",
}

const Button: NextPage<Props> = ({
  children,
  onClick,
  disabled = false,
  hidden=false,
  color = "primary",
}) => {
  return (
    <button
      className={`btn ${ButtonType[color]} btn-text ${hidden ? "btn-hidden" : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;