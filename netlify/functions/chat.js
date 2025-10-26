import fetch from "node-fetch";

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "API key is missing!" }),
    };
  }

  try {
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
    console.log("OpenRouter response:", data);

    const reply = data.choices?.[0]?.message?.content || "I'm not sure how to respond.";
    return {
      statusCode: 200,
       body: JSON.stringify({ reply: "Test message from Netlify!" })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ reply: "Something went wrong!" }) };
  }
}
