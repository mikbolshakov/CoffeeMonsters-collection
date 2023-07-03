import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { injected } from "./Connectors";
import { connectWallet, disconnectWallet } from "./StorageWallet.js";

const ConnectButton = ({ onClick }) => {
  const { activate, account, deactivate } = useWeb3React();

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
        // onClick();
      } else {
        alert("Расширение кошелька не найдено");
      }
    } catch (e) {
      console.log(e.message);
      alert("Ошибка");
    }
  };

  const shortAddress = (address) => {
    return address.substr(0, 5) + "..." + address.substr(-6);
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
