const express = require('express');

const openAiApiKey = ""; // your open ai api key

// set up express web server
const app = express();

// set up static content
app.use(express.static('public'));
app.use(express.json());

// Main page
app.get('/', async (_request, response) => {
  // increment counter in counter.txt file
  response.status(200).json({
    message: 'gigit-backend' 
  })
});

app.post('/generate', async (req, res) => {
  const prompt = req.body.content;
  console.log("RESPONSE_GENERATE_API_CALLED")
  const message = await callAi(prompt)
  res.status(200).json({
    message
  })
  return;
})
// Start web server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

async function callAi(prompt) {
  const url = "https://api.openai.com/v1/chat/completions";
  console.log("REQUEST")
  console.log("CALLING_AI_ENGINE")
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAiApiKey}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      max_tokens: 50 
    })
  });
  const data = await response.json();
  console.log("AI_ENGINE_CALL_SUCCESS")
  return data.choices[0].message.content.trim()
}
