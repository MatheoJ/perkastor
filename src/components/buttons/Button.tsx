import React from "react";

interface Props {
  onClick?: () => void;
  children: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
}

const ButtonType = {
  "primary": "btn--primary",
  "secondary": "btn--secondary",
  "tertiary": "btn--tertiary",
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  disabled = false,
  color = "primary",
}) => {
  return (
    <button
      className={`btn ${ButtonType[color]} button-text`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;