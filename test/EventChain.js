const { expect } = require("chai")

const NAME = "EventChain"
const SYMBOL = "EC"

//details about occasion 1
const OCCASION_NAME = "LEAFS vs BRUINS"
//cost is 1 ether
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "August 27th"
const OCCASION_TIME = "7:00PM EST"
const OCCASION_LOCATION = "Scotiabank Arena | Toronto, Ontario"


describe("EventChain", () => {
  let EventChain
  let deployer, buyer


  //callback function that lets us repeat similar code
  beforeEach(async () => {
    //sets up accounts for the 2 parties
    [deployer, buyer] = await ethers.getSigners()


    //getting undeplpyed contract created from hardhard
    const EventChain = await ethers.getContractFactory("EventChain")
    //deploy the contract (calls contructor from the sol file)
    eventChain = await EventChain.deploy(NAME, SYMBOL)

    //takes eventChain contract and connects the specific deployer account as the signer for the transaction
   //calls list function from sol file
   //then saves it to a transaction
    const transaction = await eventChain.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )

    //wait for the transaction to get saved to a block before continuing
    //because the occasions count needs to be correct before continuing
    await transaction.wait()
  })

  describe("Deployment", () => {
    //testing function. Check if the name is what we expect 
    it("Sets the name", async () => {
      //set name to be event chain
      expect(await eventChain.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
        //set symbol to be event chain
        expect(await eventChain.symbol()).to.equal(SYMBOL)
      })

      //test if owner's address is deployer's address
      it ("Sets the owner", async () => {
        //must check address of deployer, not just deployer
        expect (await eventChain.owner()).to.equal(deployer.address);

      })
  


  })
//test that we have succesfully created an occasion 
  describe ("Occassions", () => {
    it("Updates occasions count", async ()=> {
      const totalOccasions = await eventChain.totalOccasions()
      expect(totalOccasions).to.be.equal(1)
    })

    //checks if the attributes of the new occasion are valid
  it("Returns occasions attributes", async () => {
    //the new occassion
    const occasion = await eventChain.getOccasion(1)
    //each one checks if they are the same
    expect(occasion.id).to.be.equal(1)
    expect(occasion.name).to.be.equal(OCCASION_NAME)
    expect(occasion.cost).to.be.equal(OCCASION_COST)
    expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS)
    expect(occasion.date).to.be.equal(OCCASION_DATE)
    expect(occasion.time).to.be.equal(OCCASION_TIME)
    expect(occasion.location).to.be.equal(OCCASION_LOCATION)
  })

})

describe ("Minting", () => {
  const ID = 1
  const SEAT = 50
  const AMOUNT = ethers.utils.parseUnits('1', 'ether')
  beforeEach(async () =>{
    //connects buyer here
    //use metadata for last parameter as the function is payable
    const transaction = await eventChain.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
    await transaction.wait()
  })

  it ("Updates ticket count", async () => {
    const occasion = await eventChain.getOccasion(1)
    //makes sure tickets is max tickets -1 meaning one ticket was bought
    expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS-1)
  })

  it ("Updates buying status", async () => {
    const status = await eventChain.hasBought(ID, buyer.address)
    //makes sure the boolean updates when a person buys a ticket
    expect(status).to.be.equal(true)
  })

  it ("Updates seat status", async () => {
    const owner = await eventChain.seatTaken(ID, SEAT)
    //checks if seat is taken when updated
    expect(owner).to.be.equal(buyer.address)
  })

  it ("Updates overall seating status", async () => {
    const seats = await eventChain.getSeatsTaken(ID)
    //checks if total number of seats left is updated
    expect(seats.length).to.equal(1)
    expect(seats[0]).to.equal(SEAT)
  })

  it ("Updates the contract balance", async () => {
    const balance = await ethers.provider.getBalance(eventChain.address)
    expect(balance).to.be.equal(AMOUNT)
  })

})

//test withdraw from owner
describe("Withdrawing", () => {
  //redo minting but enhanced
  const ID = 1
  const SEAT = 50
  const AMOUNT = ethers.utils.parseUnits("1", 'ether')
  let balanceBefore

  //compare balance before and after the transaction
  beforeEach(async () => {
    balanceBefore = await ethers.provider.getBalance(deployer.address)

    //mint NFT
    let transaction = await eventChain.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
    await transaction.wait()

    //withdraw from deployers wallet
    transaction = await eventChain.connect(deployer).withdraw()
    await transaction.wait()
  })

  //owner's balance after should be > before
  it('Updates the owner balance', async () => {
    const balanceAfter = await ethers.provider.getBalance(deployer.address)
    expect(balanceAfter).to.be.greaterThan(balanceBefore)
  })

  //check if contract balance is set back to 0 afterwards
  it('Updates the contract balance', async () => {
    const balance = await ethers.provider.getBalance(eventChain.address)
    expect(balance).to.equal(0)
  })
})




})
