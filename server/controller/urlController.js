const axios = require("axios");
const urlModel = require("../models/urlModel");
const whois = require("whois-json");
const mongoose = require("mongoose");
const dns = require('dns');
const { promisify } = require('util');
const dnsLookup = promisify(dns.lookup);


async function doesDomainExist(url) {
  try {
    
    let domain = url;
    if (url.startsWith('http')) {
      domain = new URL(url).hostname;
    } else if (!url.includes('.')) {
      return false;
    }
    
   
    await dnsLookup(domain);
    return true;
  } catch (error) {
    console.log(`Domain check failed: ${error.message}`);
    return false;
  }
}

const VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/urls";
const VIRUSTOTAL_API_KEY = "9e808a3b6ccde20e20fa05efdc1a0f8bd1042ca96a3b47c7ce048db610c6a23a";

const urlCheckController = async (req, res) => {
  console.log("URL Check controller triggered, body:", req.body);
  const { url, userId } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
  
    const domainExists = await doesDomainExist(url);
    if (!domainExists) {
      return res.json({
        url,
        isMalicious: true,
        message: "⚠️ This domain does not exist or cannot be reached!",
        details: { error: "Domain not found" },
      });
    }
    const urlData = { url };
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      urlData.userId = userId;
    }
   
    const newUrl = new urlModel(urlData);
    await newUrl.save();

 
    let whoisData = {};
    try {
      whoisData = await whois(url);
    } catch (err) {
      console.warn("WHOIS lookup failed:", err.message);
    }

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
    const payload = new URLSearchParams({ url });

    const scanResponse = await axios.post(VIRUSTOTAL_API_URL, payload, {
      headers: {
        "x-apikey": VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const analysisId = scanResponse.data.data.id;

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
    return false;
  }
}

const getUrl = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const query = userId && mongoose.Types.ObjectId.isValid(userId) 
      ? { userId } 
      : {}; 
    
    const urls = await urlModel.find(query).select("-_id url");
    return res.status(200).json(urls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { urlCheckController, getUrl };

