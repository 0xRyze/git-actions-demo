# Bandit Networks' React SDK

![Demo](https://docs.bandit.network/assets/images/intro-page-386cab63755046e635acdca8c404310d.png)

Welcome to Bandit! We're so excited that you're here!

## What is Bandit Network?

Bandit offers NFT launch aggregator protocol


## Getting started

Getting started with Bandit is simple, and [you can read the full guide here](https://docs.bandit.network/docs/nft-aggregator).

Here is a shoterned version of the getting started guide:


1. [Get your Bandit API Key](https://docs.bandit.network/docs/bandit-api-key).

2. Install this npm package

3. Configure the SDK

```js
import {BanditWidget, BanditContextProvider} from "@bandit-network/sdk-react"

const App = () => {
  return (
      <BanditContextProvider 
          settings={{
            accessKey: "Your API Key"
          }}
      >
         <BanditWidget />
      </BanditContextProvider>
  )
}

export default App;
```

## Documentation

**Get started [here](https://docs.bandit.network/).**