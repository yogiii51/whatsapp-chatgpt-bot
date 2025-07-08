const express = require('express');
const { OpenAI } = require('openai');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: false }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/webhook', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const userMessage = req.body.Body;

  try {
    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'gpt-3.5-turbo',
    });

    const reply = gptResponse.choices[0].message.content;
    twiml.message(reply);
  } catch (error) {
    twiml.message('Error from ChatGPT: ' + error.message);
  }

  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot is live on port ${PORT}`));
