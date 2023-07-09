import React, { useState } from 'react';

// Ваш компонент
function YourComponent() {
  const [merchImage, setMerchImage] = useState('img11');
  const [emailVisible, setEmailVisible] = useState(false);

  const handleMerchImageChange = () => {
    setMerchImage('img22');
    setEmailVisible(true);
  };

  const handleMint = () => {
    setMerchImage('img11');
    setEmailVisible(false);
  };

  // Остальной код компонента
  return (
    <div className="mint-container">
      {/* ... */}
      <div className="details-right">
        {/* ... */}
        <div className="detail-column">
          {/* ... */}
          {selectedOption === "public" && (
            <div className="detail-row">
              <div className="detail-label">Merch</div>
              <div className="merch-buttons">
                <img src={merchImage} alt="Merch" onClick={handleMerchImageChange} />
                {emailVisible && (
                  <input type="email" placeholder="leave us your email" />
                )}
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
}
