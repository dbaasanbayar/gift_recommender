import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export async function getEmbedding(text: string): Promise<number[]> {
    const response = await groq.embeddings.create({
        model: "nomic-embed-text-v1_5",
        input: text,
    });
    return response.data[0].embedding as number[];
};
