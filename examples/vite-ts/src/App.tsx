import './App.css'
import {BanditWidget, BanditContextProvider} from "@bandit-network/sdk-react"

function App() {
  return (
      <BanditContextProvider
          settings={{
              accessKey: "73d8ed4eeddc43d8b96e0b08afb675ac"
          }}
      >
          <BanditWidget />
      </BanditContextProvider>
  )
}

export default App
