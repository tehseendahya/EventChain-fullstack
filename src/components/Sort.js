// Assets
import down from '../assets/angle-down-solid.svg'



const Sort = () => {
  return (
    <div className="sort">
      <div >
        <select class="custom-select">
          <option value="">Select Your Event Type</option>
          <option value="event1">Sport</option>
          <option value="event2">Conference</option>
          <option value="event3">Theatre</option>
          <option value="event4">Concerts</option>
        </select>
        
      </div>

      <div >
        <select class="custom-select">
          <option value="">Select Your Dates</option>
          <option value="month1">May</option>
          <option value="month2">June</option>
          <option value="month3">July</option>
          <option value="month4">August</option>
        </select>
        
      </div>

      <div >
        <select class="custom-select">
          <option value="">Select Your City</option>
          <option value="city1">Toronto</option>
          <option value="city2">Miami</option>
          <option value="city3">Dar Es Salaam</option>
          <option value="city4">New York</option>
        </select>
        
      </div>
    </div>
  );
}

export default Sort;