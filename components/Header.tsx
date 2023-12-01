import { Container, Flex, Heading } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";

const Nav: NextPage = () => {
  return (
    <Container maxW={"1600px"} py={4}>
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Heading color="white">CHAT2EARN DEMO APP</Heading>
        <ConnectWallet />
      </Flex>
    </Container>
  );
};
export default Nav;
