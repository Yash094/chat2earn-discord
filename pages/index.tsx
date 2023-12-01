import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  Web3Button,
} from "@thirdweb-dev/react";
import {
  Input,
  FormLabel,
  FormControl,
  Select,
  Card,
  Stack,
  Box,
  ButtonGroup,
  CardBody,
  CardFooter,
  Image,
  Text,
  Skeleton,
  Button,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Nav from "../components/Header";
import { NFT_COLLECTION_ADDRESS } from "../const/yourDetails";

const Home: NextPage = () => {
  const address = useAddress();

  // Fetch the NFT collection from thirdweb via it's contract address.
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );
  const { contract: chat2earnCollection } = useContract(
    "0xea8877970F58754659aDe02647Df64e59114dECD"
  );
  const { data, isLoading, error } = useContractRead(
    chat2earnCollection,
    "balanceOf",
    [address]
  );
  if (!chat2earnCollection) return <h1>Loading...</h1>;
  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    try {
      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, // Address of the current user
        }),
      });

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();
      console.log(json);
      if (!signedPayloadReq.ok) {
        alert(json.error);
      }

      // If the request succeeded, we'll get the signed payload from the response.
      // The API should come back with a JSON object containing a field called signedPayload.
      // This line of code will parse the response and store it in a variable called signedPayload.
      const signedPayload = json.signedPayload;

      // Now we can call signature.mint and pass in the signed payload that we received from the server.
      // This means we provided a signature for the user to mint an NFT with.
      const nft = await nftCollection?.signature.mint(signedPayload);
      console.log(nft);
      alert(
        "Minted succesfully! " +
          "https://mumbai.polygonscan.com/tx/" +
          nft?.receipt.transactionHash
      );

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  return (
    <div>
      <Nav />
      <div style={{ marginTop: 24 }}>
        <Box
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            p={8}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            bg="black"
            color="white"
          >
            <Card maxW="sm" bg="black">
              <CardBody>
                <Image
                  border="2px"
                  borderColor="black.200"
                  src="https://cdn-media.powerlook.in/catalog/product/4/0/404-785131.jpg"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Text color="white" fontSize="xl">
                    BOMBER JACKET
                  </Text>

                  <Text color="white" fontSize="xl">
                    Price:
                    {data && data.toString() > 0 ? (
                      <>
                        <del>0.01</del>{" "}
                        {data && data.toString() >= 4 ? (
                          <>0</>
                        ) : (
                          0.01 - data.toString() * 0.25 * 0.01
                        )}
                        <Text fontSize="sm">
                          You have received{" "}
                          {data && (data.toString() * 25).toFixed(2)}% discount
                          for your contributions in our discord server
                        </Text>
                      </>
                    ) : (
                      <>
                        0.01
                        <Text fontSize="sm">
                          Connect with the wallet or email, you have claimed your nft rewards on discord!
                        </Text>
                        {address && (
                          <Text fontSize="sm">
                            Contribute to our discord server to receieve
                            discounts!
                          </Text>
                        )}
                      </>
                    )}
                  </Text>
                  <Text color="white" fontSize="sm">
                    <Web3Button
                      contractAddress={NFT_COLLECTION_ADDRESS}
                      action={() => mintWithSignature()}
                    >
                      BUY NOW
                    </Web3Button>
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Home;
