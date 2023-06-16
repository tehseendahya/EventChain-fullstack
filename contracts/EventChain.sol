// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventChain is ERC721 {
    //owner of smart contract
    address public owner;
    //counter variable
    uint256 public totalOccasions=0;
    //number of NFTs that exist
    uint256 public totalSupply=0;


//can create own data dtypes with any parameters with struct
//can't name is event as that is a keyword
    struct Occasion{
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    //store key(variable name)-value(data) pairs
    //similar to hashmap in java
    //key is the uint256 (id) and value is the Occasion struct
    //name of map is occasions
    mapping(uint256 => Occasion) occasions;
    //nested mapping for seat number and who that seat belongs to (address)
    //occasion is key of (seat number is key of person who took seat)
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    //keep track of all taken seats so no one can buy in the future
    //array of seats that are taken
    mapping(uint256 => uint256[])seatsTaken;
    //check if a person has bought an NFT
    //makes sure an NFT is not purchased twice
    mapping(uint256 => mapping(address => bool)) public hasBought;


    //modifer lets us change behavior of a function
    modifier onlyOwner(){
        //checks if person is the owner to let the next lines run. If it is false, next code won't run
        //this way, only the owner can add occassions to the interface
        require(msg.sender == owner);
        //represents the function body so it being after means the require runs before the body
        _;
    }
    

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        //assign address of person calling the constructor as the owner
        owner = msg.sender;
    }

    function list(
        //arguments for each event
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
        //onlyOwner is the modifier making the function conditional so only the owner can add events
     ) public onlyOwner{
        //increment anytime function is called (occasion is created)
        totalOccasions++;
        //calls the mapping to pair the id (total occasions) with the value ocassions
        //this is what actually saves the struct to the blockchain
        occasions[totalOccasions] = Occasion(
            totalOccasions, 
            _name, 
            _cost, 
            _maxTickets, 
            _maxTickets, 
            _date, 
            _time, 
            _location
            );
     }

     //for minting the NFTs
     //jsut overidding the safeMint function from the open Zeppelin function
     //method is payable so the developer gets paid when selling ticket
     function mint(uint256 _id, uint256 _seat) public payable{
        //no such thing as a 0 id
        require(_id != 0);
        //make sure they don't pass in an id that isn't real
        require(_id <= totalOccasions);

        //require they are sending in enough crypto to buy the ticket
        //msg.value is the amount of crypto sent in
        require(msg.value >= occasions[_id].cost);

        //check seat is not taken and it actually exists
        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= occasions[_id].maxTickets);




        //decrement tickets as one was sold
        occasions[_id].tickets -= 1;
        //set their buying status as true
        //2 index params
        hasBought[_id][msg.sender] = true;
        //assign seat to person who bought seat
        seatTaken[_id][_seat] = msg.sender;
        //updates the seats taken array
        //push function adds element to array
        seatsTaken[_id].push(_seat);
        //increment supply of NFTs
        totalSupply++;
        //method from open zeppelin library
        _safeMint(msg.sender, totalSupply);
     }

    //accessor for number of seats taken
     function getSeatsTaken(uint256 _id) public view returns (uint256[] memory){
        return seatsTaken[_id];
     }


    //accessor method for the Ocassion when the id is passed in
    //return value is the occasion struct from memory
     function getOccasion(uint256 _id) public view returns (Occasion memory){
        return occasions[_id];
     }

     //make sure the owner (developer) can withdraw funds
     //only the owner though
     function withdraw() public onlyOwner{
        //call function sends a message to the user with the metadata of the crypto
        //calls the balance of the smart contract and sends it to the owner
        //this is because the user pays the smart contract, then here the contract pays the owner
        //blank string as no message is being sent, only money
        (bool success, ) = owner.call{value: address(this).balance}("");
        //ensures the crypto was succesfuly transfers to the wallet
        require(success);
      }
   
}
