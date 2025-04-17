// const axios = require("axios");
// const urlModel = require("../models/urlModel");
// const whois = require("whois-json");

// const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/urls";
// const VIRUSTOTAL_API_KEY =
//   "9e808a3b6ccde20e20fa05efdc1a0f8bd1042ca96a3b47c7ce048db610c6a23a";

// const urlCheckController = async (req, res) => {
//   const { url } = req.body;

//   if (!url) {
//     return res.status(400).json({ error: "URL is required" });
//   }
//   const newUrl = new urlModel({
//     userId: req.body.userId,
//     url,
//   });
//   await newUrl.save();

//   const data = await whois(url);

//   try {
//     const isMalicious = await checkUrlWithVirusTotal(url);
//     return res.json({
//       url,
//       isMalicious,
//       message: isMalicious
//         ? "⚠️ It is a malicious URL!"
//         : "✅ This URL is safe to browse.",
//       details: data,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while checking the URL" });
//   }
// };

// async function checkUrlWithVirusTotal(url) {
//   try {
//     // Step 1: Submit the URL for scanning
//     const scanResponse = await axios.post(
//       VIRUSTOTAL_API_URL,
//       { url },
//       {
//         headers: {
//           "x-apikey": VIRUSTOTAL_API_KEY,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log("Scan Response:", scanResponse.data);

//     // Extract the analysis ID from the scan response
//     const analysisId = scanResponse.data.data.id;

//     // Step 2: Wait for the analysis to complete (polling)
//     let reportResponse;
//     let attempts = 0;
//     const maxAttempts = 10; // Maximum number of attempts to check the report
//     const delay = 5000; // Delay between attempts in milliseconds

//     while (attempts < maxAttempts) {
//       reportResponse = await axios.get(
//         `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
//         {
//           headers: {
//             "x-apikey": VIRUSTOTAL_API_KEY,
//           },
//         }
//       );

//       console.log(
//         `Report Response (Attempt ${attempts + 1}):`,
//         reportResponse.data
//       );

//       // Check if the analysis is complete
//       if (reportResponse.data.data.attributes.status === "completed") {
//         break;
//       }

//       // Wait before the next attempt
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       attempts++;
//     }

//     if (attempts === maxAttempts) {
//       throw new Error("Analysis timed out");
//     }

//     // Check if the URL is malicious
//     const { stats } = reportResponse.data.data.attributes;
//     return stats.malicious > 0 || stats.suspicious > 0;
//   } catch (error) {
//     console.error(
//       "Error in checkUrlWithVirusTotal:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// }
// const getUrl = async (req, res) => {
//   try {
//     const urls = await urlModel
//       .find({ userId: req.body.userId })
//       .select("-_id url");
//     return res.status(200).json(urls);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// module.exports = { urlCheckController, getUrl };

const axios = require("axios");
const urlModel = require("../models/urlModel");
const whois = require("whois-json");

const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/urls";
const VIRUSTOTAL_API_KEY = "9e808a3b6ccde20e20fa05efdc1a0f8bd1042ca96a3b47c7ce048db610c6a23a";

const urlCheckController = async (req, res) => {
  const { url, userId } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const savedUserId = userId || "guest"; // default to guest if not provided

  try {
    // Save the URL
    const newUrl = new urlModel({
      userId: savedUserId,
      url,
    });
    await newUrl.save();

    // Get WHOIS data
    let whoisData = {};
    try {
      whoisData = await whois(url);
    } catch (err) {
      console.warn("WHOIS lookup failed:", err.message);
    }

    // Check URL with VirusTotal
    const isMalicious = await checkUrlWithVirusTotal(url);

    return res.json({
      url,
      isMalicious,
      message: isMalicious
        ? "⚠️ It is a malicious URL!"
        : "✅ This URL is safe to browse.",
      details: whoisData,
    });
  } catch (error) {
    console.error("Error checking URL:", error.message);
    res.status(500).json({ error: "An error occurred while checking the URL" });
  }
};

async function checkUrlWithVirusTotal(url) {
  try {
    // Encode URL and format for x-www-form-urlencoded
    const payload = new URLSearchParams({ url });

    const scanResponse = await axios.post(VIRUSTOTAL_API_URL, payload, {
      headers: {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const analysisId = scanResponse.data.data.id;

    // Polling for analysis result
    let reportResponse;
    let attempts = 0;
    const maxAttempts = 10;
    const delay = 5000;

    while (attempts < maxAttempts) {
      reportResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            "x-apikey": VIRUSTOTAL_API_KEY,
          },
        }
      );

      if (reportResponse.data.data.attributes.status === "completed") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      attempts++;
    }

    if (attempts === maxAttempts) {
      throw new Error("VirusTotal analysis timed out");
    }

    const { stats } = reportResponse.data.data.attributes;
    return stats.malicious > 0 || stats.suspicious > 0;
  } catch (error) {
    console.error("Error in checkUrlWithVirusTotal:", error.response?.data || error.message);
    throw error;
  }
}

const getUrl = async (req, res) => {
  try {
    const userId = req.body.userId || "guest";
    const urls = await urlModel.find({ userId }).select("-_id url");
    return res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { urlCheckController, getUrl };
