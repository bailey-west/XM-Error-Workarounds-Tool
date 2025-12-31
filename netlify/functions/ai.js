exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // 1. Get the API Key from Netlify Environment Variables
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server API Key not configured." })
        };
    }

    try {
        // 2. Parse the incoming data from the frontend
        const { messages } = JSON.parse(event.body);

        // 3. Call Groq from the server (securely)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages,
                model: "llama3-70b-8192",
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // 4. Return the result to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process AI request." })
        };
    }
};
