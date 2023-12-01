import { ThirdwebProvider, paperWallet, metamaskWallet, } from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import "./styles/globals.css";

// This is the chain your dApp will work on.

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ThirdwebProvider
        activeChain={Mumbai}
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        supportedWallets={[
          paperWallet({
            paperClientId: process.env.NEXT_PUBLIC_PAPER_CLIENT_ID,
          }),
          metamaskWallet(),
        ]}
      >
        <Head>
          <title>Chat2Earn Demo App</title>
        </Head>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
