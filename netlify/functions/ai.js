const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { messages } = JSON.parse(event.body);

        // Call the Groq API
        const chatCompletion = await groq.chat.completions.create({
            "messages": messages,
            "model": "llama-3.3-70b-versatile", // High quality model for polishing
            "temperature": 0.5,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "response_format": { "type": "json_object" }
        });

        // Return the AI's response to your HTML page
        return {
            statusCode: 200,
            body: JSON.stringify(chatCompletion)
        };

    } catch (error) {
        console.error("AI Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
