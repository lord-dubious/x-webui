import { NextRequest, NextResponse } from 'next/server';
import { prismaClient as prisma } from '@repo/db/client';
import { getUserFromRequest } from '@/lib/auth';
import { encryptData } from '@/lib/crypto';
import { validateUrl, validateApiKey, validateModelName } from '@/lib/validation';

// GET - Get user's OpenAI configuration
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        const config = await prisma.openAIConfig.findUnique({
            where: { userId: user.id },
            select: {
                apiKey: true,
                baseUrl: true,
                llmModel: true,
                embeddingModel: true,
            }
        });

        if (config) {
            // Decrypt API key for display (masked)
            const hasApiKey = !!config.apiKey;
            return NextResponse.json({
                message: "OpenAI configuration retrieved",
                config: {
                    apiKey: hasApiKey ? "***" : "",
                    baseUrl: config.baseUrl,
                    llmModel: config.llmModel,
                    embeddingModel: config.embeddingModel
                }
            });
        } else {
            return NextResponse.json({
                message: "OpenAI configuration retrieved",
                config: {
                    apiKey: "",
                    baseUrl: "https://api.openai.com/v1",
                    llmModel: "gpt-4",
                    embeddingModel: "text-embedding-3-small"
                }
            });
        }

    } catch(err: unknown) {
        console.error('OpenAI config error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';

        if (errorMessage === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            message: "Internal Server Error",
            error: errorMessage,
        }, { status: 500 });
    }
}

// POST - Update user's OpenAI configuration
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        const body = await request.json();
        const { apiKey, baseUrl, llmModel, embeddingModel } = body;

        if (!apiKey) {
            return NextResponse.json({
                message: "API key is required"
            }, { status: 400 });
        }

        // Validate API key format
        if (!validateApiKey(apiKey, 'openai')) {
            return NextResponse.json({
                message: "Invalid API key format"
            }, { status: 400 });
        }

        // Validate base URL if provided
        if (baseUrl && !validateUrl(baseUrl)) {
            return NextResponse.json({
                message: "Invalid or unsafe base URL"
            }, { status: 400 });
        }

        // Validate model names
        if (llmModel && !validateModelName(llmModel)) {
            return NextResponse.json({
                message: "Invalid LLM model name"
            }, { status: 400 });
        }

        if (embeddingModel && !validateModelName(embeddingModel)) {
            return NextResponse.json({
                message: "Invalid embedding model name"
            }, { status: 400 });
        }

        // Encrypt the API key before storing
        const encryptedApiKey = encryptData(apiKey);

        const config = await prisma.openAIConfig.upsert({
            where: { userId: user.id },
            update: {
                apiKey: encryptedApiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            },
            create: {
                userId: user.id,
                apiKey: encryptedApiKey,
                baseUrl: baseUrl || "https://api.openai.com/v1",
                llmModel: llmModel || "gpt-4",
                embeddingModel: embeddingModel || "text-embedding-3-small"
            }
        });

        return NextResponse.json({
            message: "OpenAI configuration updated successfully",
            config: {
                baseUrl: config.baseUrl,
                llmModel: config.llmModel,
                embeddingModel: config.embeddingModel
            }
        });

    } catch(err: any) {
        console.log(err);
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({
            message: "Internal Server Error",
            error: err.message,
        }, { status: 500 });
    }
}
