import React from "react";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import SocialPage from "./components/SocialPage";
import MintPage from "./components/MintPage";
import arrow from "./images/arrow.png";
import "./App.css";

function App() {
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const shouldShowButton = document.documentElement.scrollTop > 100;
      setShowButton(shouldShowButton);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const smoothScrollTo = (elementId) => {
    document.querySelector(elementId).scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div onNavClick={smoothScrollTo} className="section" id="home">
        <HomePage />
      </div>
      <div className="section" id="about">
        <AboutPage />
      </div>
      <div className="section" id="mint">
        <MintPage />
      </div>
      <div className="section" id="social">
        <SocialPage />
      </div>
      {showButton && (
        <img
          className="scroll-top-button"
          onClick={scrollToTop}
          src={arrow}
          alt="UP"
        />
      )}
    </div>
  );
}

export default App;
