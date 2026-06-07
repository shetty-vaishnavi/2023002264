const axios = require("axios");

// Paste your full access token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzc2FnYWxhQGdpdGFtLmluIiwiZXhwIjoxNzgwODExMzk1LCJpYXQiOjE3ODA4MTA0OTUsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4OTg1YWY1Mi1iMTk0LTQwOWEtODAzOS04MzI5YTM0MjE4NGQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzYWdhbGEgc2hyZWUgdmFpc2huYXZpIiwic3ViIjoiOTE2MjE4YjktZWNkYS00OTVlLWE0NDgtNmU2ZjQ3ZTY3NjQzIn0sImVtYWlsIjoic3NhZ2FsYUBnaXRhbS5pbiIsIm5hbWUiOiJzYWdhbGEgc2hyZWUgdmFpc2huYXZpIiwicm9sbE5vIjoiMjAyMzAwMjI2NCIsImFjY2Vzc0NvZGUiOiJ3Z0t0Z1oiLCJjbGllbnRJRCI6IjkxNjIxOGI5LWVjZGEtNDk1ZS1hNDQ4LTZlNmY0N2U2NzY0MyIsImNsaWVudFNlY3JldCI6Indrd25CS2dTeWp4Z0NqdVoifQ.svF2c7GruOqk7CdqJhSLr3YGFUl25oZeYDkfr7x7FLw";

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