import React from "react";

const ConnectButton = () => {
  const [metaMaskConnected, setMetaMaskConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState("");

  const shortAddress = (address) => {
    return address ? address.substr(0, 6) + "..." + address.substr(-5) : "";
  };

  const disconnectWalletHandler = () => {
    if (window.ethereum) {
      try {
        if (typeof window.ethereum.disconnect === "function") {
          window.ethereum.disconnect();
        }

        setMetaMaskConnected(false);
        setWalletAddress("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Network Name: zkSync Era Mainnet
  // RPC URL: https://mainnet.era.zksync.io
  // Chain ID: 324
  // Currency Symbol: ETH
  // Block Explorer URL: https://explorer.zksync.io/

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
        }

        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (currentChainId !== "0x13881") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x13881",
                      chainName: "Mumbai Testnet",
                      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                      nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://polygonscan.com/"],
                    },
                  ],
                });
              } catch (addError) {
                console.log(addError);
                return;
              }
            } else {
              console.log(switchError);
              return;
            }
          }
        }

        setMetaMaskConnected(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("install metamask extension!!");
    }
  };

  return (
    <>
      {metaMaskConnected ? (
        <button className="disconnect-wallet" onClick={disconnectWalletHandler}>
          {shortAddress(walletAddress)}
        </button>
      ) : (
        <button className="connect-wallet" onClick={connectMetamaskHandler}>
          Connect wallet
        </button>
      )}
    </>
  );
};

export default ConnectButton;
