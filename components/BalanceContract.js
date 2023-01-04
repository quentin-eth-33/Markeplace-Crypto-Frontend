import { contractAddresses } from "../constants/contractAddresses.json";
import { abi } from "../constants/abi.json";
import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function BalanceContract() {
  console.log("pute");
  const bal = getBalance();
  return <div>Bonjour {bal}</div>;
}

async function getBalance() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const tokenAddress =
    chainId in contractAddresses ? contractAddresses[chainId] : null;

  const [amount, setAmount] = useState("0");

  const { runContractFunction: balanceOf } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "balanceOf",
    params: { account: "0xD0a8652dBCE69e8780655C072Df8Ed9C1682bdCD" },
  });

  const balance = await balanceOf();
  console.log("Contract Addresss: ", tokenAddress);
  console.log("Balance FTT: ", balance);
  return balance;
}
