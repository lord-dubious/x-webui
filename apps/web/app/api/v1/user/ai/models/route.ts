import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import axios from 'axios';

// POST - Fetch available models from OpenAI-compatible endpoint
export async function POST(request: NextRequest) {
    try {
        await getUserFromRequest(request);

        const body = await request.json();
        const { apiKey, baseUrl } = body;

        if (!apiKey) {
            return NextResponse.json({
                message: "API key is required"
            }, { status: 400 });
        }

        const modelsUrl = `${baseUrl || "https://api.openai.com/v1"}/models`;

        const response = await axios.get(modelsUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const models = response.data.data || [];

        // Separate embedding models first (more specific)
        const embeddingModels = models.filter((model: any) =>
            model.id.includes('embedding') ||
            model.id.includes('embed')
        );

        // Then filter LLM models (exclude embedding models)
        const llmModels = models.filter((model: any) =>
            !model.id.includes('embedding') &&
            !model.id.includes('embed') &&
            !model.id.includes('whisper') &&
            !model.id.includes('tts') &&
            !model.id.includes('dall-e')
        );

        return NextResponse.json({
            message: "Models fetched successfully",
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
            message: "Failed to fetch models. Please check your API key and base URL.",
            error: err.response?.data || err.message,
        }, { status: 500 });
    }
}
