import React, { useState } from "react";
import monsterImage from "../images/Box.svg";
import arrow from "../images/CheckBox.svg";
import arrow2 from "../images/checkmark.svg";

const MintComponent = () => {
  const [selectedOption, setSelectedOption] = useState("public");
  const [nftCount, setNftCount] = useState(0);
  const [emailVisible, setEmailVisible] = useState(false);
  const [upgradedPrice, setUpgradedPrice] = useState(false);
  const [currentArrow, setCurrentArrow] = useState(arrow);

  const handleMerchImageChange = () => {
    if (currentArrow === arrow) {
      setEmailVisible(true);
      setUpgradedPrice(true);
      setCurrentArrow(arrow2);
    } else {
      setEmailVisible(false);
      setUpgradedPrice(false);
      setCurrentArrow(arrow);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleDecreaseNftCount = () => {
    if (nftCount > 0) {
      setNftCount(nftCount - 1);
    }
  };

  const handleIncreaseNftCount = () => {
    if (nftCount < 10) {
      setNftCount(nftCount + 1);
    }
  };

  const handleMint = () => {
    setNftCount(0);
    setEmailVisible(false);
    setUpgradedPrice(false);
    setCurrentArrow(arrow);
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
          className={`option ${selectedOption === "half" ? "selected" : ""}`}
          onClick={() => handleOptionChange("half")}
        >
          50% Mint
          <div className="info-button">
            ?
            <span className="info-text">
              Users with NFTs from the following collections (Proof of Narnian,
              LobsterDao, DegenScore, Harma) enjoy a 50% minting price.
            </span>
          </div>
        </div>
        <div
          className={`option ${selectedOption === "free" ? "selected" : ""}`}
          onClick={() => handleOptionChange("free")}
        >
          Free Mint
          <div className="info-button">
            ?
            <span className="info-text1">
              The CoffeeMonsters pass holder has the exclusive privilege of free
              minting opportunity.
            </span>
          </div>
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
                {selectedOption === "free"
                  ? "Free"
                  : selectedOption === "half"
                  ? "0.00333 ETH"
                  : upgradedPrice
                  ? "0.0666 ETH"
                  : "0.00666 ETH"}
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

          {selectedOption === "public" && (
            <div className="detail-column">
              <div className="detail-row">
                <div className="detail-label">
                  Merch
                  <div className="info-button">
                    ?
                    <span className="info-text2">
                      When minting NFTs with merchandise, please provide your
                      valid mailing address. We'll reach out to confirm your
                      size and delivery date, ensuring a seamless experience.
                    </span>
                  </div>
                </div>

                <div className="merch-buttons">
                  <div className="merch-container">
                    {emailVisible && (
                      <input type="email" placeholder="leave us your email" />
                    )}
                    <img
                      src={currentArrow}
                      alt="Merch"
                      onClick={handleMerchImageChange}
                    />
                  </div>
                </div>
              </div>

              <div className="merch-description">
                Add the official Coffee Monsters merch
              </div>
            </div>
          )}
        </div>
      </div>
      <button className="mint-now-button" onClick={handleMint}>
        Mint Now
      </button>
    </div>
  );
};

export default MintComponent;
