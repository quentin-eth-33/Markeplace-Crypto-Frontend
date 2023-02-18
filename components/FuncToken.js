import { contractAddresses, abi } from "../constants";
import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

export default function Token() {
  let [nameToken, setNameToken] = useState("0");
  let nameTest;
  const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  console.log(`ChainId is ${chainId}`);
  const tokenAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  console.log(`Contract address: ${tokenAddress}`);

  const { runContractFunction: getName } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "getName",
    params: {},
  });

  async function getNameFunc() {
    nameTest = await getName();
    setNameToken(nameTest);
    console.log("Nom du Token: " + nameToken);
  }

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Marketplace Crypto</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async () => await getNameFunc()}
      >
        Afficher nom de la crypto
      </button>
      <br />
      <h1>Name of the token: {nameToken}</h1>
    </div>
  );
}
