import React from "react";
import main from "../images/Main.svg";
import logo from "../images/Logo.svg";
import mint from "../images/ButtonMint.svg";
import ConnectButton from "./walletConnection/ConnectButton";

function HomePage() {
  const handleNavClick = (anchor) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home">
      <div className="home-paragraph">
        <img className="home-logo" src={logo} alt="logo" />
        <ConnectButton />
        <img src={main} alt="main" />
        <a
          href="#mint"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#mint");
          }}
        >
          <img className="home-mint" src={mint} alt="mint" />
        </a>
      </div>
    </div>
  );
}

export default HomePage;
