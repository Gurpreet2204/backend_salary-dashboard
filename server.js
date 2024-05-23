import express from 'express';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 5002;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  // Log the request body
  console.log('Request body:', req.body);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    });

    const reply = completion.data.choices[0].message.content.trim();

    // Log the OpenAI API response
    console.log('OpenAI API response:', completion);

    res.json({ reply });
  } catch (error) {
    // Log the error message and response data
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);

    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
