import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";

const ConnectButton = () => {
  const { activate, account, deactivate } = useWeb3React();

  const injected = new InjectedConnector({
    supportedChainIds: process.env.REACT_APP_CHAIN_ID,
  });

  const connectWallet = () => {
    localStorage.setItem("wallet", "metamask");
  };

  const disconnectWallet = () => {
    localStorage.removeItem("wallet");
  };

  const connectMetamaskHandler = async () => {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chainNumber = ethers.BigNumber.from(chainId).toString();

        if (
          process.env.REACT_APP_CHAIN_ID &&
          chainNumber !== process.env.REACT_APP_CHAIN_ID.toString()
        ) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: ethers.utils.hexValue(
                    parseInt(process.env.REACT_APP_CHAIN_ID)
                  ),
                },
              ],
            });
          } catch (e) {
            console.log(e.message);
            return;
          }
        }
        await activate(injected);
        connectWallet();
      } else {
        alert("Wallet extension not found");
      }
    } catch (e) {
      console.log(e.message);
      alert("Wallet connection error");
    }
  };

  const shortAddress = (address) => {
    return address.substr(0, 6) + "..." + address.substr(-5);
  };

  const disconnectWalletHandler = () => {
    deactivate();
    disconnectWallet();
  };

  return (
    <>
      {account ? (
        <button className="disconnect-wallet" onClick={disconnectWalletHandler}>
          {shortAddress(account)}
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
