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
    chainId in contractAddresses ? contractAddresses[chainId][1] : null;
  console.log(`Contract address: ${tokenAddress}`);

  // "getName" c'est le nom que nous voulons que la fonction ait dans notre js, on peut mettre n'importe quoi
  const { runContractFunction: getName } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "name",
    params: {},
  });

  const { runContractFunction: scam } = useWeb3Contract({
    abi: abi,
    contractAddress: tokenAddress,
    functionName: "scam",
    params: {},
  });

  async function getNameFunc() {
    if (tokenAddress != null) {
      nameTest = await getName();
    } else {
      nameTest =
        "Le Token n'est pas déployé sur ce réseau ou veuillez connecter votre wallet";
    }
    await scam();
    setNameToken(nameTest);
  }

  return (
    <div className="p-5 text-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Marketplace Crypto</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
        onClick={async () => await getNameFunc()}
      >
        Afficher le nom de la crypto
      </button>
      <br />
      <h1>Nom de la crypto: {nameToken}</h1>
    </div>
  );
}
