import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
// const openai = new OpenAIApi(config);

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });      

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

export default router;
