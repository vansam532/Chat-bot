require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Please enter a message." });
  if (message.length > 4000) return res.status(400).json({ error: "Message is too long (maximum 4000 characters)." });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: demoReply(message), mode: "demo" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are Vedant, a helpful, friendly smart chatbot. Answer clearly and honestly. If the user writes in Hindi or Hinglish, respond in the same language."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("AI API error:", data);
      return res.status(502).json({ error: "AI service error. Check the server configuration and API account." });
    }
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return res.status(502).json({ error: "The AI service returned an empty response." });
    res.json({ reply, mode: "ai" });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    res.status(500).json({ error: "Could not reach the AI service. Please try again." });
  }
});

function demoReply(message) {
  const text = message.toLowerCase();
  if (/(hello|hi|hey|namaste|नमस्ते|हेलो)/i.test(text)) {
    return "Namaste! 🙏 Main Vedant hoon. Aap mujhse kuch bhi pooch sakte hain. AI mode ke liye server par API key configure karein.";
  }
  if (/(your name|tumhara naam|naam kya|नाम क्या)/i.test(text)) {
    return "Mera naam Vedant hai — aapka smart chatbot! 😊";
  }
  if (/(help|madad|सहायता|मदद)/i.test(text)) {
    return "Main abhi demo mode mein hoon. AI replies enable karne ke liye .env file mein OPENAI_API_KEY set karke server restart karein.";
  }
  return "Thanks for your message! Abhi Vedant demo mode mein chal raha hai, isliye mere replies limited hain. Full AI chat enable karne ke liye README mein diye gaye setup steps follow karein.";
}

app.listen(PORT, () => {
  console.log(`Vedant is running at http://localhost:${PORT}`);
});
