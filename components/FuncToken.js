import {
  contractAddresses,
  abi,
  abiLinkToken,
  contractAddressLink,
} from "../constants";
import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function Token() {
  let [mess, setMess] = useState("0");
  let [balanceLink, setBalanceLink] = useState("0");
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  balanceLink = 0;

  const senderAddress = "0xD9aaEf7153D171da4618BF3AF21fEf6E73849dd1";
  const recipientAddress = "0x280c83b9B78aFFB194931b3ECAaBc8E528a7Ed5D";
  const amount = 5000000000000000;

  const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

  const tokenAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: transferFrom } = useWeb3Contract({
    abi: abiLinkToken,
    contractAddress: linkTokenAddress,
    functionName: "transferFrom",
    params: [senderAddress, recipientAddress, amount],
  });

  const { runContractFunction: allowance } = useWeb3Contract({
    abi: abiLinkToken,
    contractAddress: linkTokenAddress,
    functionName: "allowance",
    params: [senderAddress, recipientAddress],
  });

  const { runContractFunction: receiveLinkTokens } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "receiveLinkTokens",
    params: {},
  });

  const { runContractFunction: getBalanceInLink } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "getBalanceInLink",
    params: {},
  });

  async function handleTransferFrom() {
    try {
      const resultAllowance = await allowance();
      if (resultAllowance.lt(amount)) {
        setMess("Insufficient allowance");
        return;
      }
      const tx = await transferFrom();
      await tx.wait();
      setMess("Tokens transferred successfully!");
    } catch (error) {
      setMess("Error transferring tokens");
      console.error(error);
    }

    try {
      const tx = await receiveLinkTokens();
      await tx.wait();
      setMess("Tokens received successfully!");
    } catch (error) {
      setMess("Error receiving tokens");
      console.error(error);
    }
  }

  async function getBalanceLink() {
    balanceLink = await getBalanceInLink();
    setBalanceLink(balanceLink);
  }

  return (
    <div className="p-5 text-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Marketplace Crypto</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async () => await handleTransferFrom()}
      >
        Transférer 0.005 LINK
      </button>
      <br />
      <h1>{mess}</h1>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async () => await getBalanceLink()}
      >
        Mise à jour Balance Link
      </button>
      <h1>Balance Link: {balanceLink}</h1>
    </div>
  );
}
