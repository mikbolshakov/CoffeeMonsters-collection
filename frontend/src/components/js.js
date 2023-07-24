import React, { useState, useEffect } from "react";
import monsterImage from "../images/Box.svg";
import arrow from "../images/CheckBox.svg";
import arrow2 from "../images/checkmark.svg";
import { ethers } from "ethers";
import contractAbi from "../ABI/contractAbi.json";
import axios from "axios";

const contractAddress = "0x15d790f36CB5d0fa86B669D703534AefAd58eCCf";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

const MintComponent = () => {
  const [selectedOption, setSelectedOption] = useState("public");
  const [nftCount, setNftCount] = useState(0);
  const [emailVisible, setEmailVisible] = useState(false);
  const [upgradedPrice, setUpgradedPrice] = useState(false);
  const [currentArrow, setCurrentArrow] = useState(arrow);
  const [price, setPrice] = useState("0 ETH");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    setNftCount(0);
    setEmailVisible(false);
    setUpgradedPrice(false);
    setCurrentArrow(arrow);
  }, [selectedOption]);

  useEffect(() => {
    let price;
    if (selectedOption === "free") {
      price = "Free";
    } else if (selectedOption === "half") {
      price = (0.00333 * nftCount).toFixed(5) + " ETH";
    } else {
      price = upgradedPrice
        ? (0.0666 * nftCount).toFixed(5) + " ETH"
        : (0.00666 * nftCount).toFixed(5) + " ETH";
    }
    setPrice(price);
  }, [selectedOption, upgradedPrice, nftCount]);

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

  const validateForm = () => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    let receipt;

    if (selectedOption === "public") {
      if (emailVisible) {
        if (validateForm()) {
          try {
            const value = ethers.utils.parseEther(
              (0.1 * nftCount).toFixed(5)
            );
            const tx = await contract.publicMint(nftCount, true, {
              value: value,
            });
            receipt = await tx.wait();
          } catch (error) {
            alert("Limitation in a smart contract");
            console.error(error);
          }

          if (receipt.status === 1) {
            try {
              await axios.post("http://localhost:5555/collectors", {
                email: email,
              });
              setNftCount(0);
              setEmailVisible(false);
              setUpgradedPrice(false);
              setCurrentArrow(arrow);
            } catch (error) {
              alert("Database limitation");
              console.error(error);
            }
            alert("Successful minting!");
          }
        } else {
          console.log(
            "Error when executing a transaction on a smart contract"
          );
        }
      } else {
        try {
          const value = ethers.utils.parseEther(
            (0.01 * nftCount).toFixed(5)
          );
          const tx = await contract.publicMint(nftCount, false, {
            value: value,
          });
          await tx.wait();
          alert("Successful minting!");
        } catch (error) {
          alert("Limitation in a smart contract");
          console.error(error);
        }
      }
    } else if (selectedOption === "half") {
      try {
        const tx = await contract.mintForPartners(nftCount);
        await tx.wait();
        alert("Successful minting!");
      } catch (error) {
        alert("Limitation in a smart contract");
        console.error(error);
      }
    } else if (selectedOption === "free") {
      try {
        const tx = await contract.freeMint(nftCount);
        await tx.wait();
        alert("Successful minting!");
      } catch (error) {
        alert("Limitation in a smart contract");
        console.error(error);
      }
    }

    setNftCount(0);
    setEmailVisible(false);
    setUpgradedPrice(false);
    setCurrentArrow(arrow);
  };

  const connectMetamaskHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            console.log(res);
            return res;
          });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // Отправляем адрес на сервер
          sendWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Install MetaMask extension!");
    }
  };

  const sendWalletAddress = async (address) => {
    try {
      await axios.post("http://localhost:5555/wlcollectors", {
        walletAddress: address,
      });
      alert("Wallet address added to WL");
    } catch (error) {
      alert("This wallet is already in WL");
      console.error(error);
    }
  };

  useEffect(() => {
    connectMetamaskHandler();
  }, []);

  return (
    <div className="mint-container">
      <button onClick={WL}>WL</button>
      <h1>Mint NFT</h1>
      <div className="options-container">
        {/* ... остальной код ... */}
      </div>

      <div className="details-container">
        {/* ... остальной код ... */}
      </div>
      <button className="mint-now-button" onClick={handleMint}>
        Mint Now
      </button>
    </div>
  );
};

export default MintComponent;
