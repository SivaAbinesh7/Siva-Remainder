import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const model = import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile';

let client: Groq | null = null;

if (apiKey) {
    client = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true // Only for development
    });
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
    if (!client) {
        throw new Error('AI client not configured. Please add VITE_GROQ_API_KEY to your .env file.');
    }

    try {
        const systemMessage: ChatMessage = {
            role: 'system',
            content: 'You are SJ, a friendly and helpful AI assistant. You provide clear, concise, and accurate answers. You are supportive, encouraging, and always maintain a positive tone. Keep responses focused and helpful.'
        };

        const completion = await client.chat.completions.create({
            model,
            messages: [systemMessage, ...messages],
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
        console.error('Groq API error:', error);
        throw new Error('Failed to get AI response');
    }
}
