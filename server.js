const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

const OLLAMA_URI = process.env.OLLAMA_URI;
const MODEL = process.env.MODEL;

app.use(express.json());

function redactPII(text) {
  return text
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED SSN]")
    .replace(
      /(\d{3}[-\s]?)?(\(\d{3}\)[-\s]?)?\d{3}[-\s]?\d{4}/g,
      "[REDACTED PHONE]"
    )
    .replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
      "[REDACTED EMAIL]"
    );
}

app.post("/ask-ai", async (req, res) => {
  let userInput = req.body.prompt;

  if (!userInput) {
    return res.status(400).json({ error: "Missing prompt parameter" });
  }

  let safeInput = redactPII(userInput);
  console.log("Sanitized input:", safeInput);

  try {
    const response = await axios.post(OLLAMA_URI, {
      model: MODEL,
      prompt: safeInput,
      stream: false,
    });

    const generatedText = response.data.response;

    res.json({ response: generatedText });
  } catch (error) {
    console.error("Error calling Ollama:", error.message);
    res.status(500).json({
      error: "AI request failed",
      details: error.message,
    });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
