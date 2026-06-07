require("dotenv").config();
const axios = require("axios");



const TOKEN = process.env.ACCESS_TOKEN;
const PRIORITY = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getTopNotifications() {
  try {
    console.log("Token loaded:", TOKEN ? "YES" : "NO");

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const scored = notifications.map((n) => {
      const timestamp = new Date(n.Timestamp).getTime();

      return {
        ...n,
        score: PRIORITY[n.Type] * 1000000000000 + timestamp
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const top10 = scored.slice(0, 10);

    console.log("\nTOP 10 PRIORITY NOTIFICATIONS\n");

    top10.forEach((n, index) => {
      console.log(
        `${index + 1}. [${n.Type}] ${n.Message} (${n.Timestamp})`
      );
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

getTopNotifications();