import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

// POST - Fetch available models from Gemini API
export async function POST(request: NextRequest) {
    try {
        await getUserFromRequest(request);

        const body = await request.json();
        const { apiKey } = body;

        if (!apiKey) {
            return NextResponse.json({
                message: "API key is required"
            }, { status: 400 });
        }

        // Static list of common Gemini models
        // The current version of @google/generative-ai doesn't have listModels in older versions
        const models = [
            {
                name: "models/gemini-1.5-flash",
                displayName: "Gemini 1.5 Flash",
                description: "Fast and versatile performance across a diverse variety of tasks",
                inputTokenLimit: 1048576,
                outputTokenLimit: 8192,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/gemini-1.5-pro",
                displayName: "Gemini 1.5 Pro", 
                description: "Complex reasoning tasks requiring more intelligence",
                inputTokenLimit: 2097152,
                outputTokenLimit: 8192,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/gemini-pro",
                displayName: "Gemini Pro",
                description: "Best for scaling across a wide range of reasoning and creative tasks",
                inputTokenLimit: 30720,
                outputTokenLimit: 2048,
                supportedGenerationMethods: ["generateContent", "countTokens"]
            },
            {
                name: "models/text-embedding-004",
                displayName: "Text Embedding 004",
                description: "Obtain a distributed representation of a text",
                inputTokenLimit: 2048,
                outputTokenLimit: 1,
                supportedGenerationMethods: ["embedContent"]
            }
        ];

        // Separate embedding models
        const embeddingModels = models.filter(model => 
            model.supportedGenerationMethods.includes("embedContent")
        );

        // LLM models
        const llmModels = models.filter(model => 
            model.supportedGenerationMethods.includes("generateContent")
        );

        return NextResponse.json({
            message: "Gemini models fetched successfully",
            models: {
                llm: llmModels,
                embedding: embeddingModels
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Failed to fetch Gemini models. Please check your API key.",
            error: err.message,
        }, { status: 500 });
    }
}
