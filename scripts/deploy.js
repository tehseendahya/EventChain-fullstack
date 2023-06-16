const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  //gets account
  const [deployer] = await ethers.getSigners()
  const NAME = "EventChain"
  const SYMBOL = "EC"

  // Deploy contract
  const EventChain = await ethers.getContractFactory("EventChain")
  const eventChain = await EventChain.deploy(NAME, SYMBOL)
  //wait to be deployed
  await eventChain.deployed()

  console.log(`Deployed EventChain Contract at: ${eventChain.address}\n`)

  // List 6 events
  const occasions = [
    {
      name: "UFC Miami",
      cost: tokens(3),
      tickets: 0,//sold out
      date: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL"
    },
    {
      name: "Collision Conference",
      cost: tokens(1),
      tickets: 100,
      date: "Jun 23",
      time: "10:00AM EST",
      location: "Toronto, Canada"
    },
    {
      name: "Toronto Maple Leafs vs Carolina Hurricanes",
      cost: tokens(0.25),
      tickets: 100,
      date: "Jun 9",
      time: "7:00PM EST",
      location: "Raleigh, North Carolina"
    },
    {
      name: "Young Africans FC vs. Simba FC",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM EAT",
      location: "Benjamin Mkapa Stadium - Dar Es Salaam, Tanzania"
    },
    {
      name: "Othello by William Shakespeare",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "9:00PM EST",
      location: "Broadway Theatre - New York, New York"
    }
  ]

  //for loop to create them one by one
  for (var i = 0; i < occasions.length; i++) {
    const transaction = await eventChain.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});