const client = ZAFClient.init();
const openAiApiKey = ""; // your open ai api key

async function updateResponse() {
  const convo = await getTicketConvo();
  const prompt = await getResponsePrompt(convo);
  const res = await callbackend(prompt);
  return res
}

async function updateSummary() {
  const convo = await getTicketConvo();
  const prompt = await getSummaryPrompt(convo);
  const summary = await callAi(prompt);
  return summary
}

async function getTicketConvo() {
  const ticketConvo = await client.get("ticket.conversation");
  return JSON.stringify(ticketConvo["ticket.conversation"]);
}

async function getResponsePrompt(convo) {
  return `
Generate an approprite response the following customer service interaction as a cx executive

${convo}`;
}

async function getSummaryPrompt(convo) {
  return `
Summarize the following customer service interaction.
Detect the customer's sentiment and extract any key dates,
places, or products in the following format.

Summary:
Customer sentiment:
Key Information:

${convo}`;
}

async function callbackend(prompt) {
  const options = {
    url: "https://gigit.fly.dev/generate",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      content: prompt 
    }),
    secure: true,
  };
  const response = await client.request(options);
  console.log("response:", response)

  return response.message;
}

async function callAi(prompt) {
  const options = {
    url: "https://api.openai.com/v1/chat/completions",
    type: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
    },
    data: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
    secure: true,
  };
  const response = await client.request(options);
  console.log("response:", response)

  return response.choices[0].message.content.trim();
}

document.addEventListener("DOMContentLoaded", function () {
  const generateReplyButton = document.getElementById("generate-reply-btn");
  const generateResponseButton = document.getElementById("generate-res-btn");
  const generatedReplyDiv = document.getElementById("generated-reply");

  // generateReplyButton.addEventListener("click", async function () {
  client.on("ticket.updated", async function () {
    try {
      let updatedSummary = await updateSummary();
      generatedReplyDiv.innerText = updatedSummary;
      // Fetch ticket messages using Zendesk API
      // Use OpenAI to generate a reply
    } catch (error) {
      console.error("Error:", error);
      generatedReplyDiv.innerText = "Error generating reply.";
    }
  });

  generateReplyButton.addEventListener("click", async function () {
    // client.on("ticket.updated", async function () {
    try {
      let updatedSummary = await updateSummary();
      generatedReplyDiv.innerText = updatedSummary;
      // Fetch ticket messages using Zendesk API
      // Use OpenAI to generate a reply
    } catch (error) {
      console.error("Error:", error);
      generatedReplyDiv.innerText = "Error generating reply.";
    }
  });

  generateResponseButton.addEventListener("click", async function () {
    try {
      let updatedResponse = await updateResponse();
      generatedReplyDiv.innerText = updatedResponse;
      // Fetch ticket messages using Zendesk API
      // Use OpenAI to generate a reply
    } catch (error) {
      console.error("Error:", error);
      generatedReplyDiv.innerText = "Error generating reponse.";
    }
  });
});
