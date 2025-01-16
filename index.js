const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Predefined list of URLs
const destinations = {
  urls: [
    { name: "Google", url: "https://www.google.com" },
    { name: "GitHub", url: "https://www.github.com" },
    { name: "Node.js", url: "https://nodejs.org" }
  ]
};

let urlStatus = {};

const updateUptime = async () => {
  if (!destinations.urls || destinations.urls.length === 0) {
    console.error("No URLs found.");
    return;
  }

  const checkUrlStatus = async ({ name, url }) => {
    const currentTime = Date.now();
    if (!urlStatus[name]) {
      urlStatus[name] = {
        successfulChecks: 0,
        totalChecks: 0,
        lastChecked: currentTime,
        uptimes: [],
      };
    }

    try {
      const response = await axios.get(url);
      urlStatus[name].totalChecks += 1;
      if (response.status === 200) {
        urlStatus[name].successfulChecks += 1;
      }
    } catch (error) {
      urlStatus[name].totalChecks += 1;
    }

    const uptime = (urlStatus[name].successfulChecks / urlStatus[name].totalChecks) * 100;
    urlStatus[name].uptimes.push(uptime.toFixed(2));

    if (urlStatus[name].uptimes.length > 20) {
      urlStatus[name].uptimes.shift();
    }

    urlStatus[name].uptime = uptime.toFixed(2);
    urlStatus[name].lastChecked = currentTime;
  };

  await Promise.all(destinations.urls.map((entry) => checkUrlStatus(entry)));
};

updateUptime().then(() => {
  console.log("Initial URL status check completed.");
});

setInterval(updateUptime, 2 * 1000);

app.get("/", (req, res) => {
  res.render("main");
});

// API route to check status
app.get("/api/status", async (req, res) => {
  try {
    if (!destinations.urls || destinations.urls.length === 0) {
      return res.status(404).json({ error: "No URLs found." });
    }

    const results = destinations.urls.map(({ name, url }) => ({
      name,
      url,
      status: urlStatus[name]?.successfulChecks > 0 ? "Operational" : "Outage",
      uptime: urlStatus[name]?.uptime || "0.00",
      uptimes: urlStatus[name]?.uptimes || [],
    }));

    res.json({ results });
  } catch (error) {
    console.error("Error checking URL status:", error);
    res.status(500).json({ error: "Failed to check URL status." });
  }
});

// Catch-all route handler for all other routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
