import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import EventChain from './abis/EventChain.json'

// Config
import config from './config.json'

function App() {

  //state function lets us create a new piece of data to be tracked in front end
  //set account is function where we can write 
  const [account, setAccount] = useState(null)
  //use for connection to blockchain
  const [provider, setProvider] = useState(null)
  //for the eventChain
  const [eventChain, setEventChain] = useState(null)
  //for the occasions
  const [occasions, setOccasions] = useState([])
  //for the interface
  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)




  const loadBlockchainData = async () => {
    //need to connect metamask wallet to make the app an actual dApp
    //provider is now the blockchain connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    //hardhat blockchain network
    //passed in below
    const network = await provider.getNetwork()

    //read from config file to find address
    const address = config[network.chainId].EventChain.address

    //the web3js command to connect
    //make a javascript version of the smart contract
    //EventChain passed in is the abi 
    //wallet address is passed in for 
    const eventChain = new ethers.Contract(address, EventChain, provider)
    //setter method
    setEventChain(eventChain)

    //get all the occasions set in the backend
    const totalOccasions = await eventChain.totalOccasions()
    //array of the occasions to be listed
    const occasions = []

    //loop through all occasions
    for (var i = 1; i <= totalOccasions; i++) {
      //returns the occasion from start contract
      const occasion = await eventChain.getOccasion(i)
      //add it to the array
      occasions.push(occasion)
    }
    //sets it to smart contract variables
    setOccasions(occasions);




    //to refresh account
    //happens asynchonously
    window.ethereum.on('accountsChanged', async () => {
      //attaches metamask to JS window and returns metamask accoutn we are working with
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      //gives us string of the eth address of first account
      const account = ethers.utils.getAddress(accounts[0])
      //lets us write 
      setAccount(accounts)
    })
  }

  //react function that runs whenever the something happens to app
  useEffect(() => {
    loadBlockchainData()
  }, [])



  return (
    <div>
      <header>
        {/* navigation bar imported from top */}
        <Navigation account={account} setAccount={setAccount} />
        {/* title imported from top */}

        <h2 className="header__title">Get your <strong>Tickets!</strong> </h2>
      </header>

      <Sort />

      <div className='cards'>
        {/* allows us to loop through array and access each occasion */}
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            eventChain={eventChain}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}

      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          eventChain={eventChain}
          provider={provider}
          setToggle={setToggle}
        />
      )}


    </div>
  );
}

export default App;