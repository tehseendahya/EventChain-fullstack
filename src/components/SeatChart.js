import { useEffect, useState } from 'react'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ occasion, eventChain, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await eventChain.getSeatsTaken(occasion.id)
    setSeatsTaken(seatsTaken)
  }

  //when you want to buy a seat
  const buyHandler = async (_seat) => {
    //if seat has been purchased or not
    setHasSold(false)
    //metamask account signs the transaction
    const signer = await provider.getSigner()
    //for minting
    const transaction = await eventChain.connect(signer).mint(occasion.id, _seat, { value: occasion.cost })
    //wait until it is done being signed
    await transaction.wait()

    //after purchase, set it to true
    setHasSold(true)
  }

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close" />
        </button>

        <div className="occasion__stage">
          <strong>STAGE, FIELD, ARENA, COURT, etc</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1 ">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(Number(occasion.maxTickets) - 50).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={26}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={15}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(25).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={(Number(occasion.maxTickets) - 24)}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={5}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;