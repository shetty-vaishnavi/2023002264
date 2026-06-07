const axios = require("axios");

// Paste your full access token here
const TOKEN = process.env.ACCESS_TOKEN;
async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: packageName,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.log(
      "Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;