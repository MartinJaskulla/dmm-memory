import React from 'react';
import './Header.css';
import owlImgSrc from '../images/owl.svg';

export function Header() {
  return (
    <header className="header">
      <h1 className="heading-1">
        <img alt="Memory Game Logo" className="logo" src={owlImgSrc} />
        Memory Game
      </h1>
    </header>
  );
}
