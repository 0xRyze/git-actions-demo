import './App.css'
import {BanditWidget, BanditContextProvider} from "@bandit-network/sdk-react"

function App() {
  return (
      <BanditContextProvider
          settings={{
              accessKey: "ACCESS KEY"
          }}
      >
          <BanditWidget />
      </BanditContextProvider>
  )
}

export default App
