import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import animalNames from "../../animalNames";
import "../styles/globals.css";
import { NFT_COLLECTION_ADDRESS } from "../../const/yourDetails";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { authorAddress, nftName } = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.WALLET_PRIVATE_KEY) {
      throw new Error(
        "You're missing WALLET_PRIVATE_KEY in your .env.local file."
      );
    }

    // Initialize the Thirdweb SDK on the server side
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Your wallet private key (read it in from .env.local file)
      process.env.WALLET_PRIVATE_KEY as string,
      "mumbai",
      { secretKey: process.env.TW_SECRET_KEY }
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = await sdk.getContract(
      // Use your NFT_COLLECTION_ADDRESS constant
      NFT_COLLECTION_ADDRESS,
      "nft-collection"
    );
    const chat2Earn = await sdk.getContract(
      "0xea8877970F58754659aDe02647Df64e59114dECD"
    );
    let balance = await chat2Earn.call("balanceOf", [authorAddress]);
    balance = balance.toString();
    let discount = 0;
    if (balance >= 4) {
      discount = 0.01;
    } else {
      discount = balance * 0.25 * 0.01;
    }
    // Generate the signature for the page NFT
    const signedPayload = await nftCollection.signature.generate({
      to: authorAddress,
      price: 0.01 - discount,
      metadata: {
        name: "BOMBER JACKET",
        description:
          "This is demo product used to showcase the working of chat2earn discord rewards!",
        image:
          "https://cdn-media.powerlook.in/catalog/product/4/0/404-785131.jpg",
      },
    });

    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: `Server error ${e}` });
  }
}
