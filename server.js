import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

console.log("OpenRouter API key loaded:", !!process.env.OPENROUTER_API_KEY);

const app = express();
app.use(express.json());
app.use(express.static(".")); // serves index.html & assets

// Helper function to check for simple commands
function handleSimpleCommands(message) {
  const msg = message.toLowerCase();

  if (msg.includes("date")) {
    const today = new Date();
    return `Today's date is ${today.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}.`;
  }

  if (msg.includes("time")) {
    const now = new Date();
    return `Current time is ${now.toLocaleTimeString("en-GB")}.`;
  }

  if (msg.includes("your name")) {
    return "I’m called Assistant! How can I help you today?";
  }

  return null; // No simple command matched
}

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  // First, check for simple commands locally
  const simpleReply = handleSimpleCommands(userMessage);
  if (simpleReply) {
    return res.json({ reply: simpleReply });
  }

  // Otherwise, forward to OpenRouter AI
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm not sure how to respond.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Something went wrong!" });
  }
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
