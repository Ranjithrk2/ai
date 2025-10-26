import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Simple commands locally
    const simpleReply = getSimpleReply(userMessage);
    if (simpleReply) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: simpleReply }),
      };
    }

    // Call OpenRouter AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "I'm not sure how to respond.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Netlify function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Something went wrong!" }),
    };
  }
};

// Simple command handler
function getSimpleReply(msg) {
  if (!msg) return null;
  const text = msg.toLowerCase();
  if (text.includes("date")) return `Today's date is ${new Date().toLocaleDateString()}`;
  if (text.includes("time")) return `Current time is ${new Date().toLocaleTimeString()}`;
  if (text.includes("your name")) return "I’m called Assistant! How can I help you today?";
  return null;
}
