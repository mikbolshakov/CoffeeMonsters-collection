import React, { useState } from "react";
import monsterImage from "../images/Box.svg";

const MintComponent = () => {
  const [selectedOption, setSelectedOption] = useState("free");
  const [nftCount, setNftCount] = useState(0);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleDecreaseNftCount = () => {
    if (nftCount > 0) {
      setNftCount(nftCount - 1);
    }
  };

  const handleIncreaseNftCount = () => {
    setNftCount(nftCount + 1);
  };

  const handleMint = () => {
    setNftCount(0);
  };

  return (
    <div className="mint-container">
      <h1>Mint NFT</h1>
      <div className="options-container">
        <div
          className={`option ${selectedOption === "public" ? "selected" : ""}`}
          onClick={() => handleOptionChange("public")}
        >
          Public Mint
        </div>
        <div
          className={`option ${selectedOption === "free" ? "selected" : ""}`}
          onClick={() => handleOptionChange("free")}
        >
          Free Mint
        </div>
        <div className={`underline ${selectedOption}`} />
      </div>
      <div className="details-container">
        <div className="details-left">
          <img src={monsterImage} alt="Monster" className="monster-image" />
        </div>
        <div className="details-right">
          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Price</div>
              <div className="detail-value">
                {selectedOption === "free" ? "Free" : "0.33 ETH"}
              </div>
            </div>
          </div>
          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Max Mint Per Wallet</div>
              <div className="detail-value">10</div>
            </div>
          </div>
          <div className="detail-column">
            <div className="detail-row">
              <div className="detail-label">Number</div>
              <div className="number-buttons">
                <button onClick={handleDecreaseNftCount}>-</button>
                <span>{nftCount}</span>
                <button onClick={handleIncreaseNftCount}>+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="mint-now-button" onClick={handleMint}>
        Mint Now
      </button>
    </div>
  );
};

export default MintComponent;
