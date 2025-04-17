// import React, { useState } from 'react';
// import "./Loginresult.css";

// const Loginresult = () => {

//   return (
//    <div className="resultcard">
//            <div className="result">
//                <h1 className="resultheader">Enter URL</h1>
//                 <div className="resultfield">
//                    <label>URL: </label>
//                    <input type="text" placeholder="Enter your URL" />
//                </div>
//                <div className="submitbtn">
//                    <button className="btn17">
//                        <span className="textcontainer">
//                            <span className="text">Is it a phish?</span>
//                        </span>
//                    </button>
//                </div>
//            </div>
//            </div>
//   )
// }

// export default Loginresult

import React, { useState } from 'react';
import './Loginresult.css'; 

const Loginresult = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckPhish = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, userId: "guest" }), 
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to check URL' });
    }
    setLoading(false);
  };

  return (
    <div className="resultcard">
      <div className="result">
        <h1 className="resultheader">Enter URL</h1>
        <div className="resultfield">
          <label>URL:</label>
          <input
            type="text"
            placeholder="Enter your URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="submitbtn">
          <button className="btn17" onClick={handleCheckPhish}>
            <span className="textcontainer">
              <span className="text">Is it a phish?</span>
            </span>
          </button>
        </div>

        {loading && <div className="loading-spinner">Checking...</div>}

        {result && !result.error && (
          <div className={`result-box ${result.isMalicious ? 'danger' : 'safe'}`}>
            <h2>{result.message}</h2>
          </div>
        )}

        {result?.error && (
          <div className="error-box">
            <p>{result.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginresult;
