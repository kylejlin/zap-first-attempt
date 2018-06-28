import React from 'react';
import './Button.css';

const Button = ({
  className,
  children,

  onClick,
}) => (
  <button
    className={'Zap-Button ' + className}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
