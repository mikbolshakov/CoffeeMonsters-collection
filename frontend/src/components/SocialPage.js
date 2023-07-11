import React from "react";
import twitter from "../images/Twitter.svg";
import instagram from "../images/Instagram.svg";
import attic from "../images/Attic.svg";

function SocialPage() {
  const redirectToInstagram = () => {
    window.open(
      "https://www.instagram.com/coffeemonsters_croco/",
      "_blank",
      "noopener noreferrer"
    );
  };

  const redirectToTwitter = () => {
    window.open(
      "https://twitter.com/The_Croco_Team",
      "_blank",
      "noopener noreferrer"
    );
  };

  const redirectToAttic = () => {
    window.open(
      "https://atticc.xyz/c/0x232c4428F5291297c653BC6906C5225fD5C5D075",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <div className="social">
      <div className="social-paragraph">
        <div onClick={redirectToInstagram}>
          <img src={instagram} alt="instagram" />
          <p>Instagram</p>
        </div>
        <div onClick={redirectToTwitter}>
          <img src={twitter} alt="twitter" />
          <p>Twitter</p>
        </div>
        <div onClick={redirectToAttic} Ы>
          <img src={attic} alt="attic" />
          <p>Attic</p>
        </div>
      </div>
    </div>
  );
}

export default SocialPage;
