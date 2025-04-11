import React, { useState } from 'react';
import "./Loginresult.css";

const Loginresult = () => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocation(query);

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&filter=countrycode:in&apiKey=1db3c494724342c787346c1adf082be2`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (place) => {
    setLocation(place.properties.formatted);
    setSuggestions([]);
  };

  return (
   <div className="resultcard">
           <div className="result">
               <h1 className="resultheader">Enter URL</h1>
                <div className="resultfield">
                   <label>URL: </label>
                   <input type="text" placeholder="Enter your URL" />
               </div>
               {/* <div className="resultfield">
                   <label>Location: </label>
                   <input type="text" placeholder="Enter your location" />
               </div>
               <div className="resultfield">
                   <label>Date: </label>
                   <input type="date" />
               </div>
               <div className="resultfield">
                   <label>Time: </label>
                   <input type="time" />
               </div>
               <div className="resultgender" >
                   <label>Gender: </label>
                   <div className="resultradiobtn">
                       <label>Male </label>
                       <input type="radio" name="myGender" />
                       <label>Female </label>
                       <input type="radio" name="myGender" />
                   </div>
               </div>        */}
   
               {/* <div className="resultfield">
                   <label>Email-Id: </label>
                   <input type="email" placeholder="Enter your email" />
               </div>
               <div className="resultfield">
                   <label>Password: </label>
                   <input type="password" />
               </div> */}
               <div className="submitbtn">
                   <button className="btn17">
                       <span className="textcontainer">
                           <span className="text">Is it a phish?</span>
                       </span>
                   </button>
               </div>
           </div>
           </div>
  )
}

export default Loginresult
